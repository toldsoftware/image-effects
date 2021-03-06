"use strict";
var draw_quad_1 = require("./draw-quad");
var draw_with_blur_1 = require("./draw-with-blur");
var draw_images_aligned_1 = require("./draw-images-aligned");
var DEBUG = false;
var DEBUG_MOUSE = false;
var HANDLE_RADIUS = 0.1;
var DEFAULT_MOVE_HANDLE_RADIUS = 0.25;
var MAX_DRAG_DISTANCE_SQ = HANDLE_RADIUS * HANDLE_RADIUS;
// const MAX_MOVE_DISTANCE_SQ = DEFAULT_MOVE_HANDLE_RADIUS * DEFAULT_MOVE_HANDLE_RADIUS;
var TIME_REMOVE_HANDLES = 3000;
var MOVEMENT_RATIO = 0.5;
var ImageHandleKind;
(function (ImageHandleKind) {
    ImageHandleKind[ImageHandleKind["Stretch"] = 0] = "Stretch";
    ImageHandleKind[ImageHandleKind["RotateAndScale"] = 1] = "RotateAndScale";
    ImageHandleKind[ImageHandleKind["Anchor"] = 2] = "Anchor";
})(ImageHandleKind = exports.ImageHandleKind || (exports.ImageHandleKind = {}));
function setupUserFitting(options) {
    var shouldMoveProductHandles = options.shouldMoveProductHandles;
    var moveHandleRadius = options.moveHandleRadius || DEFAULT_MOVE_HANDLE_RADIUS;
    var MAX_MOVE_DISTANCE_SQ = moveHandleRadius * moveHandleRadius;
    options.productImageHandles = clone(options.productImageHandles);
    var cvs = document.createElement('canvas');
    options.host.appendChild(cvs);
    cvs.width = options.host.clientWidth;
    cvs.height = options.host.clientHeight;
    cvs.style.width = '100%';
    var w = cvs.width | 600;
    var h = cvs.height | 600;
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
    userImage.onload = function () {
        // ctx.save();
        // ctx.globalAlpha = 0.15;
        // ctx.drawImage(userImage, 0, 0);
        // ctx.restore();
        // c.width = userImage.width;
        // c.height = userImage.height;
        refresh();
    };
    userImage.src = options.userImageUrl;
    var productImage = new Image();
    productImage.onload = function () {
        if (DEBUG) {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.drawImage(productImage, 0, 0);
            ctx.restore();
        }
        refresh();
    };
    productImage.src = options.productImageUrl;
    var productImage_adjusted;
    var refresh = function () {
        if (!userImage.width || !productImage.width) {
            setTimeout(refresh, 250);
            return;
        }
        var c = { canvas: cvs, context: ctx, width: w || 600, height: h || 600 };
        // if (!DEBUG) {
        c.width = w = cvs.width;
        c.height = h = cvs.height;
        //}
        // Debug - Draw with shadows
        // if (productImage_adjusted == null) {
        //     let buffer = new DrawingBuffer(productImage.width, productImage.height);
        //     drawWithShade(buffer.context, productImage.width, productImage.height, '#000000', 0.15, ctx2 => {
        //         ctx2.drawImage(productImage, 0, 0, productImage.width, productImage.height);
        //     });
        //     productImage_adjusted = buffer.canvas;
        // }
        // // Resize for aspect ratio
        // if (productImage_adjusted == null) {
        //     // const aspectRatio = productImage.width / productImage.height;
        //     const aspectRatio = 1;
        //     let buffer = new DrawingBuffer(productImage.width, aspectRatio * productImage.height);
        //     // drawWithShade(buffer.context, productImage.width, productImage.height, '#000000', 0.15, ctx2 => {
        //     //     ctx2.drawImage(productImage, 0, 0, productImage.width, productImage.height);
        //     // });
        //     buffer.context.drawImage(productImage, 0, 0, productImage.width, productImage.height);
        //     productImage_adjusted = buffer.canvas;
        //     for (let key in options.productImageHandles) {
        //         if (options.productImageHandles.hasOwnProperty(key)) {
        //             const handle = options.productImageHandles[key];
        //             log('handle y before', handle.y, aspectRatio);
        //             handle.y = handle.y / aspectRatio;
        //             log('handle y after', handle.y, aspectRatio);
        //         }
        //     }
        // }
        // TODO: Re-implement dragging
        var actual = refreshUserFitting_simple(c, userImage, productImage, options, shouldDrawHandles);
        // if (!isDraggingNearest && !isMovingProduct) {
        // handles_move[0].x = actual.a.u;
        // handles_move[0].y = actual.a.v;
        // handles_move[1].x = actual.b.u;
        // handles_move[1].y = actual.b.v;
        // }
        // refreshUserFitting_simple(c, userImage, productImage_adjusted, options);
        if (shouldMoveProductHandles) {
            ctx.globalAlpha = 0.75;
            ctx.drawImage(productImage_adjusted, 0, 0, w, h);
            ctx.globalAlpha = 1;
            drawHandles(ctx, w, h, options.productImageHandles, '#FFFF00');
        }
    };
    setTimeout(refresh, 250);
    var handles_move = [];
    if (!shouldMoveProductHandles) {
        for (var k in options.userImageHandles) {
            if (options.productImageHandles[k]) {
                handles_move.push(options.userImageHandles[k]);
            }
        }
    }
    else {
        // Move the product handles instead
        for (var k in options.userImageHandles) {
            if (options.productImageHandles[k]) {
                handles_move.push(options.productImageHandles[k]);
            }
        }
    }
    var getHandleInfo = function (e) {
        var rect = cvs.getBoundingClientRect();
        var xm = 0;
        var ym = 0;
        var xm2 = null;
        var ym2 = null;
        if (e.clientX != null) {
            xm = e.clientX - rect.left;
            ym = e.clientY - rect.top;
        }
        else if (e.touches != null) {
            xm = e.touches[0].clientX - rect.left;
            ym = e.touches[0].clientY - rect.top;
            if (e.touches[1]) {
                if (DEBUG_MOUSE) {
                    console.log('2 FINGER');
                }
                xm2 = e.touches[1].clientX - rect.left;
                ym2 = e.touches[1].clientY - rect.top;
            }
        }
        if (DEBUG_MOUSE) {
            console.log('Mouse Down', xm, ym, xm2, ym2, e);
        }
        var xh = xm / w;
        var yh = ym / h;
        var nearest = handles_move.map(function (s) { return ({ handle: s, distanceSq: (s.x - xh) * (s.x - xh) + (s.y - yh) * (s.y - yh) }); }).sort(function (a, b) { return a.distanceSq - b.distanceSq; })[0];
        var xh2 = xm2 ? xm2 / w : null;
        var yh2 = ym2 ? ym2 / h : null;
        return { xh: xh, yh: yh, nearest: nearest, xh2: xh2, yh2: yh2 };
    };
    var shouldDrawHandles = false;
    var isMovingProduct = false;
    var isDraggingNearest = false;
    var xh_start = 0;
    var yh_start = 0;
    var hNearest = null;
    var xh2_start = 0;
    var yh2_start = 0;
    // let userHandles_old = clone(options.userImageHandles);
    // let productHandles_old = clone(options.productImageHandles);
    var dragEnd = function () {
        unsubscribe();
        isDraggingNearest = isMovingProduct = false;
        // // Report move
        // if (options.onMove) {
        //     const userHandles_new = clone(options.userImageHandles);
        //     const delta_productImageHandles = {} as ImageHandles;
        //     // for (let k in userHandles_new) {
        //     //     if (userHandles_new.hasOwnProperty(k)) {
        //     //         delta_productImageHandles[k] = 
        //     //     }
        //     // }
        //     options.onMove({
        //         imageHandles: userHandles_new,
        //         imageHandles_old: userHandles_old,
        //         delta_productImageHandles
        //     });
        //     userHandles_old = clone(options.userImageHandles);
        //     productHandles_old = clone(options.productImageHandles);
        // }
    };
    var dragStart = function (e) {
        subscribe();
        var _a = getHandleInfo(e), xh = _a.xh, yh = _a.yh, nearest = _a.nearest, xh2 = _a.xh2, yh2 = _a.yh2;
        xh_start = xh;
        yh_start = yh;
        xh2_start = xh2;
        yh2_start = yh2;
        handles_move.forEach(function (s) {
            s.x_start = s.x;
            s.y_start = s.y;
            s.nearestTouch = 0;
            if (xh2 != null) {
                var xhd = s.x - xh;
                var yhd = s.y - yh;
                var xhd2 = s.x - xh2;
                var yhd2 = s.y - yh2;
                if (xhd * xhd + yhd * yhd
                    > xhd2 * xhd2 + yhd2 * yhd2) {
                    s.nearestTouch = 1;
                }
            }
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
            drawHandles(ctx, w, h, handles_move, '#00FF00');
            drawHandles(ctx, w, h, [nearest.handle], '#FF0000');
        }
    };
    var timeoutId = -1;
    var dragMove = function (e) {
        if (!isDraggingNearest && !isMovingProduct) {
            return;
        }
        // Move the nearest handle
        var _a = getHandleInfo(e), xh = _a.xh, yh = _a.yh, nearest = _a.nearest, xh2 = _a.xh2, yh2 = _a.yh2;
        if (isDraggingNearest) {
            var s = hNearest;
            s.x = s.x_start + (xh - xh_start) * MOVEMENT_RATIO;
            s.y = s.y_start + (yh - yh_start) * MOVEMENT_RATIO;
        }
        else if (isMovingProduct) {
            handles_move.forEach(function (s) {
                var xhd = xh - xh_start;
                var yhd = yh - yh_start;
                var xhd2 = xh2 - xh2_start;
                var yhd2 = yh2 - yh2_start;
                if (xh2 == null) {
                    s.x = s.x_start + xhd * MOVEMENT_RATIO;
                    s.y = s.y_start + yhd * MOVEMENT_RATIO;
                }
                else {
                    // Each point moves with nearest finger
                    if (s.nearestTouch === 0) {
                        s.x = s.x_start + xhd * MOVEMENT_RATIO;
                        s.y = s.y_start + yhd * MOVEMENT_RATIO;
                    }
                    else {
                        s.x = s.x_start + xhd2 * MOVEMENT_RATIO;
                        s.y = s.y_start + yhd2 * MOVEMENT_RATIO;
                    }
                }
            });
        }
        refresh();
        shouldDrawHandles = true;
        // drawHandles(ctx, w, h, handles_move, '#0000FF');
        // if (isDraggingNearest) {
        //     drawHandles(ctx, w, h, [hNearest], '#00FF00');
        // }
        // else {
        //     let xMain = handles_move.reduce((out, s) => out += s.x, 0) / handles_move.length;
        //     let yMain = handles_move.reduce((out, s) => out += s.y, 0) / handles_move.length;
        //     drawMainHandle(ctx, w, h, xMain, yMain, '#00FF00');
        // }
        var removeHandles = function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                if (isDraggingNearest) {
                    removeHandles();
                    return;
                }
                shouldDrawHandles = false;
                refresh();
            }, TIME_REMOVE_HANDLES);
        };
        removeHandles();
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    cvs.addEventListener('mousedown', dragStart);
    cvs.addEventListener('touchstart', dragStart);
    var subscribe = function () {
        // console.log('subscribe');
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('touchmove', dragMove, { passive: false });
    };
    var unsubscribe = function () {
        // console.log('unsubscribe');
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchend', dragEnd);
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('touchmove', dragMove);
    };
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
function clone(obj) {
    var c = {};
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            if (typeof obj[k] === 'object') {
                c[k] = clone(obj[k]);
            }
            else {
                c[k] = obj[k];
            }
        }
    }
    return c;
}
function refreshUserFitting_simple(c, userImage, productImage, options, shouldDrawHandles) {
    // log('refresh');
    c.context.clearRect(0, 0, c.width, c.height);
    var actualPosition = draw_images_aligned_1.drawImagesAligned(c, [toSimpleImageInfo(userImage, options.userImageHandles), toSimpleImageInfo(productImage, options.productImageHandles)], shouldDrawHandles);
    return actualPosition;
}
function toSimpleImageInfo(image, imageHandles) {
    var aHandle = imageHandles['left_temple'];
    var bHandle = imageHandles['right_temple'];
    return {
        image: image,
        a: { u: aHandle.x, v: aHandle.y },
        b: { u: bHandle.x, v: bHandle.y },
    };
}
function refreshUserFitting_old(c, userImage, productImage, options) {
    log('refresh');
    c.context.clearRect(0, 0, c.width, c.height);
    c.context.drawImage(userImage, 0, 0, c.width, c.height);
    drawImageAligned(c, productImage, options.productImageHandles, options.userImageHandles);
}
function drawImageAligned(c, image, handles, handleTargets) {
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
    log('gaps', gaps);
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
    // ctx.rotate(mainAngle);
    // Calculate y_top and y_bottom for each stretch handle
    var stretches = handles_stretches.map(function (s) {
        var sourceLeft_yRatioFromTop = s.source.y;
        var sourceLeft_yRatioFromBottom = 1 - sourceLeft_yRatioFromTop;
        var targetTop = s.target.y - targetScale * sourceLeft_yRatioFromTop;
        var targetBottom = s.target.y + targetScale * sourceLeft_yRatioFromBottom;
        return {
            source: s.source,
            target_orig: s.target,
            target: s.target,
            x_top_target: s.target.x + rotateX(0, targetTop - s.target.y, mainAngle),
            x_bottom_target: s.target.x + rotateX(0, targetBottom - s.target.y, mainAngle),
            y_top_target: s.target.y + rotateY(0, targetTop - s.target.y, mainAngle),
            y_bottom_target: s.target.y + rotateY(0, targetBottom - s.target.y, mainAngle),
        };
    });
    var columnCount = stretches.length - 1;
    var grid = [];
    gaps.reverse();
    var columnOrder = gaps.filter(function (g) { return g.xDistance > 0; }).map(function (g) { return g.i; });
    var _loop_1 = function (ic) {
        var i = columnOrder[ic];
        var sourceTop = 0;
        var sourceBottom = 1;
        var left = stretches[i];
        var right = stretches[i + 1];
        var sourceLeft = left.source.x;
        var sourceRight = right.source.x;
        var targetLeft = left.target.x;
        var targetRight = right.target.x;
        var x_top_left_target = left.x_top_target;
        var x_bottom_left_target = left.x_bottom_target;
        var x_top_right_target = right.x_top_target;
        var x_bottom_right_target = right.x_bottom_target;
        // Calculate the y scale
        var y_top_left_target = left.y_top_target;
        var y_bottom_left_target = left.y_bottom_target;
        var y_top_right_target = right.y_top_target;
        var y_bottom_right_target = right.y_bottom_target;
        if (i === 0) {
            var changeRatio = (sourceRight - 0) / (sourceRight - sourceLeft);
            var targetPerSourceScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
            // targetLeft = targetRight - targetPerSourceScale * sourceRight;
            x_top_left_target = x_top_right_target - targetPerSourceScale * sourceRight;
            x_bottom_left_target = x_bottom_right_target - targetPerSourceScale * sourceRight;
            sourceLeft = 0;
            y_top_left_target = y_top_right_target - changeRatio * (y_top_right_target - y_top_left_target);
            y_bottom_left_target = y_bottom_right_target - changeRatio * (y_bottom_right_target - y_bottom_left_target);
        }
        if (i === columnCount - 1) {
            var changeRatio = (1 - sourceLeft) / (sourceRight - sourceLeft);
            var tScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
            // targetRight = targetLeft + tScale * (1 - sourceLeft);
            x_top_right_target = x_top_left_target + tScale * (1 - sourceLeft);
            x_bottom_right_target = x_bottom_left_target + tScale * (1 - sourceLeft);
            sourceRight = 1;
            y_top_right_target = y_top_left_target + changeRatio * (y_top_right_target - y_top_left_target);
            y_bottom_right_target = y_bottom_left_target + changeRatio * (y_bottom_right_target - y_bottom_left_target);
        }
        grid.push([{
                source: { x_left: sourceLeft, x_right: sourceRight, y_top: sourceTop, y_bottom: sourceBottom },
                target: {
                    x_top_left: x_top_left_target, x_bottom_left: x_bottom_left_target, x_top_right: x_top_right_target, x_bottom_right: x_bottom_right_target,
                    y_top_left: y_top_left_target, y_bottom_left: y_bottom_left_target, y_top_right: y_top_right_target, y_bottom_right: y_bottom_right_target
                }
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
        // drawTriangle(ctx, image,
        //     w * g.target.x_left, h * g.target.y_top_left,
        //     w * g.target.x_right, h * g.target.y_top_right,
        //     w * g.target.x_left, h * g.target.y_bottom_left,
        //     image.width * g.source.x_left, image.height * g.source.y_top,
        //     image.width * g.source.x_right, image.height * g.source.y_top,
        //     image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG
        // );
        // drawTriangle(ctx, image,
        //     w * g.target.x_right, h * g.target.y_top_right,
        //     w * g.target.x_right, h * g.target.y_bottom_right,
        //     w * g.target.x_left, h * g.target.y_bottom_left,
        //     image.width * g.source.x_right, image.height * g.source.y_top,
        //     image.width * g.source.x_right, image.height * g.source.y_bottom,
        //     image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG
        // );
        draw_with_blur_1.drawWithEdgeBlur(ctx, w, h, function (ctx2) {
            draw_quad_1.drawQuad(ctx2, image, w * g.target.x_top_left, h * g.target.y_top_left, w * g.target.x_top_right, h * g.target.y_top_right, w * g.target.x_bottom_right, h * g.target.y_bottom_right, w * g.target.x_bottom_left, h * g.target.y_bottom_left, image.width * g.source.x_left, image.height * g.source.y_top, image.width * g.source.x_right, image.height * g.source.y_top, image.width * g.source.x_right, image.height * g.source.y_bottom, image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG);
        });
        // break;
    };
    for (var ic = 0; ic < columnCount; ic++) {
        _loop_1(ic);
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
        var xMain = stretches.reduce(function (out, s) { return out += s.target.x; }, 0) / stretches.length;
        var yMain = stretches.reduce(function (out, s) { return out += s.target.y; }, 0) / stretches.length;
        drawMainHandle(ctx, w, h, xMain, yMain, '#00FF00');
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
function rotateX(x, y, angle) {
    var x_rotate = x * Math.cos(angle) - y * Math.sin(angle);
    return x_rotate;
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
    var radius = HANDLE_RADIUS * w;
    var thickness = 2;
    for (var k in handles) {
        log('draw handle');
        var handle = handles[k];
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        // ctx.beginPath();
        // ctx.moveTo(handle.x * w - radius, handle.y * h);
        // ctx.lineTo(handle.x * w + radius, handle.y * h);
        // ctx.stroke();
        // ctx.beginPath();
        // ctx.moveTo(handle.x * w, handle.y * h - radius);
        // ctx.lineTo(handle.x * w, handle.y * h + radius);
        // ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(handle.x * w, handle.y * h, radius * 0.25, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
function drawMainHandle(ctx, w, h, x, y, color) {
    // ctx.beginPath();
    // ctx.globalAlpha = 1;
    // ctx.strokeStyle = color;
    // ctx.arc(x * w, y * h, MOVE_RADIUS * w, 0, Math.PI * 2, false);
    // //   ctx.arc(x * w, y * h, 0.01 * MOVE_RADIUS * w, 0, Math.PI * 2, false);
    // ctx.stroke();
    // ctx.globalAlpha = 1;
}
function drawImageSection(ctx, image, handle, handleTargets) {
}
//# sourceMappingURL=user-fitting.js.map