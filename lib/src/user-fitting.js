"use strict";
var draw_triangle_1 = require("./draw-triangle");
var DEBUG = false;
var DEBUG_MOUSE = false;
var MAX_DRAG_DISTANCE_SQ = 0.05 * 0.05;
var MAX_MOVE_DISTANCE_SQ = 0.25 * 0.25;
var TIME_REMOVE_HANDLES = 3000;
var HANDLE_RADIUS = 4;
var MOVEMENT_RATIO = 0.5;
var ImageHandleKind;
(function (ImageHandleKind) {
    ImageHandleKind[ImageHandleKind["Stretch"] = 0] = "Stretch";
    ImageHandleKind[ImageHandleKind["RotateAndScale"] = 1] = "RotateAndScale";
    ImageHandleKind[ImageHandleKind["Anchor"] = 2] = "Anchor";
})(ImageHandleKind = exports.ImageHandleKind || (exports.ImageHandleKind = {}));
function setupUserFitting(options) {
    var cvs = document.createElement('canvas');
    options.host.appendChild(cvs);
    cvs.width = options.host.clientWidth;
    cvs.height = options.host.clientHeight;
    var w = cvs.width;
    var h = cvs.height;
    // // Oversize to be able to see better
    // if (DEBUG) {
    //     cvs.width = 1200;
    //     cvs.height = 800;
    //     w = 600;
    //     h = 600;
    // }
    var ctx = cvs.getContext('2d');
    if (DEBUG) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, w, h);
    }
    // TODO: Add Image Loader (for iOS)
    var userImage = new Image();
    userImage.src = options.userImageUrl;
    userImage.onload = function () {
        // ctx.save();
        // ctx.globalAlpha = 0.15;
        // ctx.drawImage(userImage, 0, 0);
        // ctx.restore();
        // c.width = userImage.width;
        // c.height = userImage.height;
        refresh();
    };
    var productImage = new Image();
    productImage.src = options.productImageUrl;
    productImage.onload = function () {
        if (DEBUG) {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.drawImage(productImage, 0, 0);
            ctx.restore();
        }
        refresh();
    };
    var c = { context: ctx, width: w, height: h };
    var refresh = function () {
        if (!DEBUG) {
            c.width = w = cvs.width;
            c.height = h = cvs.height;
        }
        refreshUserFitting(c, userImage, productImage, options);
    };
    setTimeout(refresh);
    var userHandles = [];
    for (var k in options.userImageHandles) {
        userHandles.push(options.userImageHandles[k]);
    }
    var getHandleInfo = function (e) {
        var rect = cvs.getBoundingClientRect();
        var xm = 0;
        var ym = 0;
        if (e.clientX != null) {
            xm = e.clientX - rect.left;
            ym = e.clientY - rect.top;
        }
        else if (e.touches != null) {
            xm = e.touches[0].clientX - rect.left;
            ym = e.touches[0].clientY - rect.top;
        }
        if (DEBUG_MOUSE) {
            console.log('Mouse Down', xm, ym, e);
        }
        var xh = xm / w;
        var yh = ym / h;
        var nearest = userHandles.map(function (s) { return ({ handle: s, distanceSq: (s.x - xh) * (s.x - xh) + (s.y - yh) * (s.y - yh) }); }).sort(function (a, b) { return a.distanceSq - b.distanceSq; })[0];
        return { xh: xh, yh: yh, nearest: nearest };
    };
    var isMovingProduct = false;
    var isDraggingNearest = false;
    var xh_start = 0;
    var yh_start = 0;
    var hNearest = null;
    var dragEnd = function () { return isDraggingNearest = isMovingProduct = false; };
    var dragStart = function (e) {
        var _a = getHandleInfo(e), xh = _a.xh, yh = _a.yh, nearest = _a.nearest;
        xh_start = xh;
        yh_start = yh;
        userHandles.forEach(function (s) {
            s.x_start = s.x;
            s.y_start = s.y;
        });
        if (nearest.distanceSq < MAX_DRAG_DISTANCE_SQ) {
            isDraggingNearest = true;
            hNearest = nearest.handle;
        }
        else if (nearest.distanceSq < MAX_MOVE_DISTANCE_SQ) {
            isMovingProduct = true;
        }
        if (DEBUG_MOUSE) {
            console.log('isDraggingPoint', isDraggingNearest, 'isMovingProduct', isMovingProduct);
            drawHandles(ctx, w, h, userHandles, '#00FF00');
            drawHandles(ctx, w, h, [nearest.handle], '#FF0000');
        }
    };
    var timeoutId = -1;
    var dragMove = function (e) {
        if (!isDraggingNearest && !isMovingProduct) {
            return;
        }
        // Move the nearest handle
        var _a = getHandleInfo(e), xh = _a.xh, yh = _a.yh;
        if (isDraggingNearest) {
            var s = hNearest;
            s.x = s.x_start + (xh - xh_start) * MOVEMENT_RATIO;
            s.y = s.y_start + (yh - yh_start) * MOVEMENT_RATIO;
        }
        else if (isMovingProduct) {
            userHandles.forEach(function (s) {
                s.x = s.x_start + (xh - xh_start) * MOVEMENT_RATIO;
                s.y = s.y_start + (yh - yh_start) * MOVEMENT_RATIO;
            });
        }
        refresh();
        // if (DEBUG_MOUSE) {
        drawHandles(ctx, w, h, userHandles, '#0000FF');
        if (isDraggingNearest) {
            drawHandles(ctx, w, h, [hNearest], '#00FF00');
        }
        // }
        var removeHandles = function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                if (isDraggingNearest) {
                    removeHandles();
                    return;
                }
                refresh();
            }, TIME_REMOVE_HANDLES);
        };
        removeHandles();
        e.preventDefault();
        return false;
    };
    cvs.addEventListener('mousedown', dragStart);
    cvs.addEventListener('touchstart', dragStart);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove);
}
exports.setupUserFitting = setupUserFitting;
function log(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (DEBUG) {
        console.log.apply(console, [message].concat(args));
    }
}
function refreshUserFitting(c, userImage, productImage, options) {
    log('refresh');
    drawImage(c, userImage, options.userImageHandles, options.userImageHandles);
    drawImage(c, productImage, options.productImageHandles, options.userImageHandles);
}
function drawImage(c, image, handles, handleTargets) {
    var ctx = c.context;
    var w = c.width;
    var h = c.height;
    var handlesMerged = [];
    for (var k in handles) {
        handlesMerged.push({ source: handles[k], target: handleTargets[k] });
    }
    handlesMerged = handlesMerged.sort(function (a, b) { return a.source.x - b.source.x; });
    // Just do a row of cells for now (only vertical dividers)
    var handles_stretches = handlesMerged.filter(function (x) { return x.source.kind !== ImageHandleKind.Anchor; });
    var gaps = handles_stretches.map(function (s, i) { return ({ i: i, prev: s, next: handles_stretches[i + 1], xDistance: (handles_stretches[i + 1] || { source: { x: s.source.x } }).source.x - s.source.x }); });
    gaps.sort(function (a, b) { return b.xDistance - a.xDistance; });
    // log('gaps', gaps);
    var widest = gaps[0];
    var targetScale = (widest.next.target.x - widest.prev.target.x) /
        (widest.next.source.x - widest.prev.source.x);
    var y_delta_source = widest.next.source.y - widest.prev.source.y;
    var x_delta_source = widest.next.source.x - widest.prev.source.x;
    var y_delta_target = widest.next.target.y - widest.prev.target.y;
    var x_delta_target = widest.next.target.x - widest.prev.target.x;
    var sourceAngle = Math.atan(y_delta_source / x_delta_source);
    var targetAngle = Math.atan(y_delta_target / x_delta_target);
    var mainAngle = targetAngle - sourceAngle;
    // TEMP: Testing
    // mainAngle = 0;
    log('targetScale', targetScale, 'y_delta_source', y_delta_source, 'x_delta_source', x_delta_source, 'y_delta_target', y_delta_target, 'x_delta_target', x_delta_target, 'sourceAngle', sourceAngle * 180 / Math.PI, 'targetAngle', targetAngle * 180 / Math.PI, 'mainAngle', mainAngle * 180 / Math.PI);
    ctx.save();
    ctx.rotate(mainAngle);
    // Calculate y_top and y_bottom for each stretch handle
    var stretches = handles_stretches.map(function (s) {
        var sourceLeft_yRatioFromTop = s.source.y;
        var sourceLeft_yRatioFromBottom = 1 - sourceLeft_yRatioFromTop;
        var targetTop = s.target.y - targetScale * sourceLeft_yRatioFromTop;
        var targetBottom = s.target.y + targetScale * sourceLeft_yRatioFromBottom;
        return {
            source: s.source,
            target_orig: s.target,
            target: rotate(s.target, -mainAngle),
            y_top_target: rotateY(s.target.x, targetTop, -mainAngle),
            y_bottom_target: rotateY(s.target.x, targetBottom, -mainAngle),
        };
    });
    var columnCount = stretches.length - 1;
    var grid = [];
    gaps.reverse();
    var columnOrder = gaps.filter(function (g) { return g.xDistance > 0; }).map(function (g) { return g.i; });
    for (var ico = 0; ico < columnCount; ico++) {
        var i = columnOrder[ico];
        var sourceTop = 0;
        var sourceBottom = 1;
        var left = stretches[i];
        var right = stretches[i + 1];
        var sourceLeft = left.source.x;
        var sourceRight = right.source.x;
        var targetLeft = left.target.x;
        var targetRight = right.target.x;
        // Calculate the y scale
        var target_top_left = left.y_top_target;
        var target_bottom_left = left.y_bottom_target;
        var target_top_right = right.y_top_target;
        var target_bottom_right = right.y_bottom_target;
        if (i === 0) {
            var changeRatio = (sourceRight - 0) / (sourceRight - sourceLeft);
            var targetPerSourceScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
            targetLeft = targetRight - targetPerSourceScale * sourceRight;
            sourceLeft = 0;
            target_top_left = target_top_right - changeRatio * (target_top_right - target_top_left);
            target_bottom_left = target_bottom_right - changeRatio * (target_bottom_right - target_bottom_left);
        }
        if (i === columnCount - 1) {
            var changeRatio = (1 - sourceLeft) / (sourceRight - sourceLeft);
            var tScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
            targetRight = targetLeft + tScale * (1 - sourceLeft);
            sourceRight = 1;
            target_top_right = target_top_left + changeRatio * (target_top_right - target_top_left);
            target_bottom_right = target_bottom_left + changeRatio * (target_bottom_right - target_bottom_left);
        }
        grid.push([{
                source: { x_left: sourceLeft, x_right: sourceRight, y_top: sourceTop, y_bottom: sourceBottom },
                target: { x_left: targetLeft, x_right: targetRight, y_top_left: target_top_left, y_bottom_left: target_bottom_left, y_top_right: target_top_right, y_bottom_right: target_bottom_right }
            }]);
        var g = grid[grid.length - 1][0];
        log('Source:', g.source);
        log('Target:', g.target);
        // drawTriangle(ctx, image,
        //     w * g.source.x_left, h * g.source.y_top,
        //     w * g.source.x_right, h * g.source.y_top,
        //     w * g.source.x_left, h * g.source.y_bottom,
        //     image.width * g.source.x_left, image.height * g.source.y_top,
        //     image.width * g.source.x_right, image.height * g.source.y_top,
        //     image.width * g.source.x_left, image.height * g.source.y_bottom
        // );
        // drawTriangle(ctx, image,
        //     w * g.source.x_right, h * g.source.y_top,
        //     w * g.source.x_right, h * g.source.y_bottom,
        //     w * g.source.x_left, h * g.source.y_bottom,
        //     image.width * g.source.x_right, image.height * g.source.y_top,
        //     image.width * g.source.x_right, image.height * g.source.y_bottom,
        //     image.width * g.source.x_left, image.height * g.source.y_bottom
        // );
        // drawTriangle(ctx, image,
        //     w * g.target.x_left, h * g.target.y_top,
        //     w * g.target.x_right, h * g.target.y_top,
        //     w * g.target.x_left, h * g.target.y_bottom,
        //     image.width * g.target.x_left, image.height * g.target.y_top,
        //     image.width * g.target.x_right, image.height * g.target.y_top,
        //     image.width * g.target.x_left, image.height * g.target.y_bottom
        // );
        // drawTriangle(ctx, image,
        //     w * g.target.x_right, h * g.target.y_top,
        //     w * g.target.x_right, h * g.target.y_bottom,
        //     w * g.target.x_left, h * g.target.y_bottom,
        //     image.width * g.target.x_right, image.height * g.target.y_top,
        //     image.width * g.target.x_right, image.height * g.target.y_bottom,
        //     image.width * g.target.x_left, image.height * g.target.y_bottom
        // );
        draw_triangle_1.drawTriangle(ctx, image, w * g.target.x_left, h * g.target.y_top_left, w * g.target.x_right, h * g.target.y_top_right, w * g.target.x_left, h * g.target.y_bottom_left, image.width * g.source.x_left, image.height * g.source.y_top, image.width * g.source.x_right, image.height * g.source.y_top, image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG);
        draw_triangle_1.drawTriangle(ctx, image, w * g.target.x_right, h * g.target.y_top_right, w * g.target.x_right, h * g.target.y_bottom_right, w * g.target.x_left, h * g.target.y_bottom_left, image.width * g.source.x_right, image.height * g.source.y_top, image.width * g.source.x_right, image.height * g.source.y_bottom, image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG);
    }
    if (DEBUG) {
        stretches.forEach(function (s) {
            log('draw stretch', s);
            ctx.beginPath();
            ctx.strokeStyle = '#FF00FF';
            ctx.moveTo(w * s.target_orig.x, h * s.target_orig.y);
            ctx.lineTo(w * s.target.x, h * s.target.y);
            ctx.stroke();
            // ctx.beginPath();
            // ctx.strokeStyle = '#00FFFF';
            // ctx.moveTo(w * s.target.x, h * s.target.x);
            // ctx.stroke();
        });
        drawHandles(ctx, w, h, stretches.map(function (s) { return s.target; }), '#FF00FF');
        drawHandles(ctx, w, h, handles, '#FF0000');
        drawHandles(ctx, w, h, handleTargets, '#00FF00');
    }
    ctx.restore();
}
function rotate(handle, angle) {
    var x_rotate = handle.x * Math.cos(angle) - handle.y * Math.sin(angle);
    var y_rotate = handle.x * Math.sin(angle) + handle.y * Math.cos(angle);
    return {
        kind: handle.kind,
        x: x_rotate,
        y: y_rotate,
    };
}
function rotateY(x, y, angle) {
    var y_rotate = x * Math.sin(angle) + y * Math.cos(angle);
    return y_rotate;
}
function calculateScale(s0, s1, t0, t1) {
    // if (s0 <= s1 || t0 <= t1) { return 0; }
    return (t1 - t0) / (s1 - s0);
}
function calculateSkewY(sx0, sx1, sy0, sy1, ty0, ty1) {
    var dsx = sx1 - sx0;
    var dsy = sy1 - sy0;
    var dty = ty1 - ty0;
    return (dty - dsy) / dsx;
}
function drawHandles(ctx, w, h, handles, color) {
    var radius = HANDLE_RADIUS;
    for (var k in handles) {
        log('draw handle');
        var handle = handles[k];
        ctx.beginPath();
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = color;
        // ctx.moveTo(handle.x * w - len, handle.y * h);
        // ctx.lineTo(handle.x * w + len, handle.y * h);
        // ctx.moveTo(handle.x * w, handle.y * h - len);
        // ctx.lineTo(handle.x * w, handle.y * h + len);
        // ctx.stroke();
        ctx.fillStyle = color;
        ctx.arc(handle.x * w, handle.y * h, radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
function drawImageSection(ctx, image, handle, handleTargets) {
}
//# sourceMappingURL=user-fitting.js.map