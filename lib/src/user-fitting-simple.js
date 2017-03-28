"use strict";
var drawing_buffer_1 = require("./drawing-buffer");
var draw_images_aligned_1 = require("./draw-images-aligned");
var DEBUG = false;
var ImageHandleKind;
(function (ImageHandleKind) {
    ImageHandleKind[ImageHandleKind["Stretch"] = 0] = "Stretch";
    ImageHandleKind[ImageHandleKind["RotateAndScale"] = 1] = "RotateAndScale";
    ImageHandleKind[ImageHandleKind["Anchor"] = 2] = "Anchor";
})(ImageHandleKind = exports.ImageHandleKind || (exports.ImageHandleKind = {}));
function setupUserFitting(options) {
    var c = new drawing_buffer_1.DrawingBuffer(options.host.clientWidth || 600, options.host.clientHeight || 600);
    options.host.appendChild(c.canvas);
    c.canvas.style.width = '100%';
    // Load Images
    var userImage = new Image();
    userImage.onload = function () {
        refresh();
    };
    userImage.src = options.userImageUrl;
    var productImage = new Image();
    productImage.onload = function () {
        refresh();
    };
    productImage.src = options.productImageUrl;
    // Input Vars
    var shouldDrawHandles = false;
    var lastActualScale = 1;
    // Draw
    var refresh = function () {
        if (!userImage.width || !productImage.width) {
            setTimeout(refresh, 250);
            return;
        }
        c.context.clearRect(0, 0, options.host.clientWidth, options.host.clientHeight);
        var actual = draw_images_aligned_1.drawImagesAligned(c, [toSimpleImageInfo(userImage, options.userImageHandles), toSimpleImageInfo(productImage, options.productImageHandles)], shouldDrawHandles);
        lastActualScale = actual.actualScale;
        return actual.actualPosition;
    };
    refresh();
    // Handle User Input
    if (options.isReadonly) {
        return;
    }
    handleUserInput(c, function (drawHandles, positionChange) {
        shouldDrawHandles = drawHandles;
        console.log('positionChange', positionChange, lastActualScale, userImage.width, c.width, userImage.height, c.height);
        if (!positionChange) {
            options.userImageHandles.left_temple.x_start = options.userImageHandles.left_temple.x;
            options.userImageHandles.left_temple.y_start = options.userImageHandles.left_temple.y;
            options.userImageHandles.right_temple.x_start = options.userImageHandles.right_temple.x;
            options.userImageHandles.right_temple.y_start = options.userImageHandles.right_temple.y;
        }
        else {
            options.userImageHandles.left_temple.x = options.userImageHandles.left_temple.x_start + positionChange.a.u; // * (userImage.width / c.width);
            options.userImageHandles.left_temple.y = options.userImageHandles.left_temple.y_start + positionChange.a.v * (userImage.width / userImage.height); // * (userImage.height / c.height);
            options.userImageHandles.right_temple.x = options.userImageHandles.right_temple.x_start + positionChange.b.u; // * (userImage.width / c.width);
            options.userImageHandles.right_temple.y = options.userImageHandles.right_temple.y_start + positionChange.b.v * (userImage.width / userImage.height); // * (userImage.height / c.height);
        }
        var result = refresh();
        if (DEBUG && positionChange) {
            draw_images_aligned_1.drawPoint(c, { u: 0.5 + positionChange.a.u, v: 0.5 + positionChange.a.v }, '#0000FF');
            draw_images_aligned_1.drawPoint(c, { u: 0.5 + positionChange.b.u, v: 0.5 + positionChange.b.v }, '#0000FF');
        }
        if (options.onMove) {
            options.onMove();
        }
        return result;
    });
    return {
        refresh: refresh
    };
}
exports.setupUserFitting = setupUserFitting;
function toSimpleImageInfo(image, imageHandles) {
    var aHandle = imageHandles.left_temple;
    var bHandle = imageHandles.right_temple;
    return {
        image: image,
        a: { u: aHandle.x, v: aHandle.y },
        b: { u: bHandle.x, v: bHandle.y },
    };
}
function handleUserInput(c, onChange) {
    var MOVEMENT_RATIO = 0.5;
    var MAX_DRAG_RATIO = 0.25;
    var TIME_REMOVE_HANDLES = 3000;
    var lastActualPosition = null;
    var isDraggingWhole = false;
    var isDraggingPoint = false;
    var start = null;
    var startPosition = null;
    var shouldDrawHandles = false;
    var removeHandlesTimeoutId = null;
    var dragStart = function (e) {
        console.log('dragStart');
        if (!lastActualPosition) {
            lastActualPosition = onChange(shouldDrawHandles, null);
        }
        if (!lastActualPosition) {
            return;
        }
        startPosition = lastActualPosition;
        start = getPointInfo(e, c, [startPosition.a, startPosition.b]);
        shouldDrawHandles = true;
        // console.log('dragStart', e, lastActual, start);
        var nearest = start.nearest;
        if (!nearest) {
            return;
        }
        subscribe();
        var distance = draw_images_aligned_1.getDistance(lastActualPosition);
        var maxMoveWholeDistanceSq = distance * distance;
        var maxMovePointDistanceSq = maxMoveWholeDistanceSq * MAX_DRAG_RATIO * MAX_DRAG_RATIO;
        if (nearest.distanceSq < maxMovePointDistanceSq) {
            isDraggingPoint = true;
        }
        else if (nearest.distanceSq < maxMoveWholeDistanceSq) {
            isDraggingWhole = true;
        }
        if (DEBUG) {
            setTimeout(function () {
                console.log('dragStart distance', distance);
                draw_images_aligned_1.drawPoint(c, start, '#FF0000', c.width * Math.sqrt(nearest.distanceSq));
                draw_images_aligned_1.drawPoint(c, start, '#FFFF00', c.width * Math.sqrt(maxMovePointDistanceSq));
                draw_images_aligned_1.drawPoint(c, start, '#FF00FF', c.width * Math.sqrt(maxMoveWholeDistanceSq));
            }, 10);
            console.log('dragStart', isDraggingPoint, isDraggingWhole, nearest.distanceSq, maxMovePointDistanceSq, maxMoveWholeDistanceSq, e, lastActualPosition, start);
        }
        onChange(shouldDrawHandles, null);
    };
    var dragEnd = function () {
        console.log('dragEnd');
        unsubscribe();
        isDraggingPoint = isDraggingWhole = false;
    };
    var dragMove = function (e) {
        console.log('dragMove');
        if (!isDraggingPoint && !isDraggingWhole) {
            return;
        }
        shouldDrawHandles = true;
        // Move the nearest point
        var _a = getPointInfo(e, c, [lastActualPosition.a, lastActualPosition.b]), u = _a.u, v = _a.v, u2 = _a.u2, v2 = _a.v2, nearest = _a.nearest;
        var startPoint = start.nearest.index === 0 ? startPosition.a : startPosition.b;
        var newPoint = { u: 0, v: 0 };
        newPoint.u = (u - start.u) * MOVEMENT_RATIO;
        newPoint.v = (v - start.v) * MOVEMENT_RATIO;
        var newPoint2 = { u: 0, v: 0 };
        newPoint2.u = (u2 - start.u2) * MOVEMENT_RATIO;
        newPoint2.v = (v2 - start.v2) * MOVEMENT_RATIO;
        var positionChange = { a: { u: 0, v: 0 }, b: { u: 0, v: 0 } };
        if (isDraggingPoint) {
            if (start.nearest.index === 0) {
                positionChange.a = newPoint;
                positionChange.b = newPoint2;
            }
            else {
                positionChange.b = newPoint;
                positionChange.a = newPoint2;
            }
        }
        else if (isDraggingWhole) {
            positionChange.a = newPoint;
            positionChange.b = newPoint;
        }
        lastActualPosition = onChange(shouldDrawHandles, positionChange);
        var removeHandles = function () {
            clearTimeout(removeHandlesTimeoutId);
            removeHandlesTimeoutId = setTimeout(function () {
                if (isDraggingPoint) {
                    removeHandles();
                    return;
                }
                shouldDrawHandles = false;
                onChange(shouldDrawHandles, null);
            }, TIME_REMOVE_HANDLES);
        };
        removeHandles();
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    };
    c.canvas.addEventListener('mousedown', dragStart);
    c.canvas.addEventListener('touchstart', dragStart);
    c.canvas.addEventListener('touchend', dragEnd);
    c.canvas.addEventListener('touchmove', dragMove);
    var subscribe = function () {
        // console.log('subscribe');
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', dragMove);
    };
    var unsubscribe = function () {
        // console.log('unsubscribe');
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('mousemove', dragMove);
    };
}
function getPointInfo(e, c, points) {
    var cvs = c.canvas;
    var w = c.width;
    var h = c.height;
    var rect = cvs.getBoundingClientRect();
    var xm = 0;
    var ym = 0;
    var xm2 = null;
    var ym2 = null;
    var eMouse = e;
    var eTouch = e;
    if (eMouse.clientX != null) {
        xm = eMouse.clientX - rect.left;
        ym = eMouse.clientY - rect.top;
    }
    else if (eTouch.touches != null) {
        xm = eTouch.touches[0].clientX - rect.left;
        ym = eTouch.touches[0].clientY - rect.top;
        if (eTouch.touches[1]) {
            xm2 = eTouch.touches[1].clientX - rect.left;
            ym2 = eTouch.touches[1].clientY - rect.top;
        }
    }
    var u = xm / w;
    var v = ym / h;
    var u2 = xm2 ? xm2 / w : null;
    var v2 = ym2 ? ym2 / h : null;
    var nearest = !points || !points.length ? null
        : points.map(function (p, i) { return ({ point: p, index: i, distanceSq: (p.u - u) * (p.u - u) + (p.v - v) * (p.v - v) }); }).sort(function (a, b) { return a.distanceSq - b.distanceSq; })[0];
    // DEBUG
    if (DEBUG) {
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var p = points_1[_i];
            draw_images_aligned_1.drawPoint(c, p, '#FFFF00', 4);
        }
        draw_images_aligned_1.drawPoint(c, { u: u, v: v }, '#FF00FF', 4);
        if (u2) {
            draw_images_aligned_1.drawPoint(c, { u: u2, v: v2 }, '#FF00FF', 4);
        }
        draw_images_aligned_1.drawPoint(c, nearest.point, '#FF0000', 4);
    }
    return { u: u, v: v, u2: u2, v2: v2, nearest: nearest };
}
;
var tempPointInfo = null && getPointInfo(null, null, null);
//# sourceMappingURL=user-fitting-simple.js.map