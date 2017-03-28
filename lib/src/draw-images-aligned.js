"use strict";
var drawing_buffer_1 = require("./drawing-buffer");
var draw_with_blur_1 = require("./draw-with-blur");
var buffer = new drawing_buffer_1.DrawingBuffer(1200, 1200);
function drawImagesAligned(cOrig, images, shouldDrawPosition) {
    // Anti-alias by drawing at a higher scale and resizing after merging
    // const scale = 600 / cOrig.width;
    var drawScale = 2;
    var wBuffer = drawScale * cOrig.width;
    var hBuffer = drawScale * cOrig.height;
    buffer.clear(wBuffer, hBuffer);
    var c = buffer;
    // Draw the main image and get it's actual position
    var mainImage = images[0];
    var _a = drawImageCentered(c, mainImage), mainPosition = _a.mainPosition, mainScale = _a.mainScale;
    // Draw each image
    for (var i = 0; i < images.length; i++) {
        if (i === 0) {
            continue;
        }
        drawImageAligned(c, images[i], mainPosition);
    }
    if (shouldDrawPosition) {
        drawPosition(c, mainPosition);
    }
    // Resize
    cOrig.context.drawImage(buffer.canvas, 0, 0, wBuffer, hBuffer, 0, 0, cOrig.width, cOrig.height);
    // const actualPosition = {
    //     a: {
    //         u: mainPosition.a.u / scale,
    //         v: mainPosition.a.v / scale,
    //     },
    //     b: {
    //         u: mainPosition.b.u / scale,
    //         v: mainPosition.b.v / scale,
    //     }
    // };
    var actualPosition = mainPosition;
    return { actualPosition: actualPosition, actualScale: mainScale * drawScale };
}
exports.drawImagesAligned = drawImagesAligned;
function drawImageCentered(c, image) {
    var w = c.width;
    var h = c.height;
    var wImage = image.image.width;
    var hImage = image.image.height;
    var wScale = w / wImage;
    var hScale = h / hImage;
    // Fill
    // const scale = Math.max(wScale, hScale);
    // Fit Inside
    var mainScale = Math.min(wScale, hScale);
    // const scale = 1;
    var x = 0.5 * (w - mainScale * wImage);
    var y = 0.5 * (h - mainScale * hImage);
    c.context.drawImage(image.image, 0, 0, wImage, hImage, x, y, mainScale * wImage, mainScale * hImage);
    var mainPosition = {
        a: {
            u: (x + image.a.u * wImage * mainScale) / w,
            v: (y + image.a.v * hImage * mainScale) / h,
        },
        b: {
            u: (x + image.b.u * wImage * mainScale) / w,
            v: (y + image.b.v * hImage * mainScale) / h,
        },
    };
    return { mainPosition: mainPosition, mainScale: mainScale };
}
function drawPosition(c, position) {
    drawPoint(c, position.a);
    drawPoint(c, position.b);
}
exports.drawPosition = drawPosition;
function drawPoint(c, point, color, radius) {
    if (color === void 0) { color = '#00FF00'; }
    if (radius === void 0) { radius = 16; }
    var ctx = c.context;
    var w = c.width;
    var h = c.height;
    var thickness = 2;
    var u = point.u;
    var v = point.v;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    // ctx.beginPath();
    // ctx.moveTo(u * w - radius, v * h);
    // ctx.lineTo(u * w + radius, v * h);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(u * w, v * h - radius);
    // ctx.lineTo(u * w, v * h + radius);
    // ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(u * w, v * h, radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.globalAlpha = 1;
}
exports.drawPoint = drawPoint;
function drawImageAligned(c, image, position) {
    var uAxis = (position.a.u + position.b.u) * 0.5;
    var vAxis = (position.a.v + position.b.v) * 0.5;
    var uAxis_image = (image.a.u + image.b.u) * 0.5;
    var vAxis_image = (image.a.v + image.b.v) * 0.5;
    var ctx = c.context;
    var w = c.width;
    var h = c.height;
    var wImage = image.image.width;
    var hImage = image.image.height;
    var posDistance = getDistance(position);
    var imageDistance = getDistance(image);
    var uvScale = posDistance / imageDistance;
    var scale = uvScale * w / wImage;
    // console.log('distance', posDistance, imageDistance, scale, w, h, wImage, hImage);
    var posAngle = getAngle(position);
    var imageAngle = getAngle(image);
    var angle = posAngle - imageAngle;
    var xAxis = w * uAxis;
    var yAxis = h * vAxis;
    var xImage = xAxis - uAxis_image * scale * wImage;
    var yImage = yAxis - vAxis_image * scale * hImage;
    ctx.save();
    ctx.translate(uAxis * w, vAxis * h);
    ctx.rotate(angle);
    ctx.translate(-uAxis * w, -vAxis * h);
    // ctx.drawImage(image.image,
    //     0, 0, wImage, hImage,
    //     xImage, yImage, scale * wImage, scale * hImage
    // );
    draw_with_blur_1.drawWithEdgeBlur(ctx, w, h, function (ctx2) {
        ctx2.drawImage(image.image, 0, 0, wImage, hImage, xImage, yImage, scale * wImage, scale * hImage);
    });
    ctx.restore();
}
function getDistance(position) {
    var uDelta = position.a.u - position.b.u;
    var vDelta = position.a.v - position.b.v;
    return Math.sqrt(uDelta * uDelta + vDelta * vDelta);
}
exports.getDistance = getDistance;
function getAngle(position) {
    var uDelta = position.a.u - position.b.u;
    var vDelta = position.a.v - position.b.v;
    return Math.atan(vDelta / uDelta);
}
//# sourceMappingURL=draw-images-aligned.js.map