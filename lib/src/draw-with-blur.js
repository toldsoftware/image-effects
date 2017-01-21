"use strict";
var drawing_buffer_1 = require("./drawing-buffer");
var drawBuffer;
var blurBuffer;
var mergeBuffer;
// Draw edge blur by downsampling image to half size, drawing that first and then drawing sharp image on top
function drawWithEdgeBlur(ctx, width, height, draw) {
    var downsample_ratio = 0.5;
    var downsample_alpha = 0.5;
    if (drawBuffer == null) {
        drawBuffer = new drawing_buffer_1.DrawingBuffer(width, height);
    }
    drawBuffer.clear(width, height);
    if (blurBuffer == null) {
        blurBuffer = new drawing_buffer_1.DrawingBuffer(width * downsample_ratio, height * downsample_ratio);
    }
    blurBuffer.clear(width * downsample_ratio, height * downsample_ratio);
    if (mergeBuffer == null) {
        mergeBuffer = new drawing_buffer_1.DrawingBuffer(width, height);
    }
    mergeBuffer.clear(width, height);
    draw(drawBuffer.context);
    blurBuffer.context.drawImage(drawBuffer.canvas, 0, 0, width, height, 0, 0, width * downsample_ratio, height * downsample_ratio);
    mergeBuffer.context.globalAlpha = downsample_alpha;
    mergeBuffer.context.drawImage(blurBuffer.canvas, 0, 0, width * downsample_ratio, height * downsample_ratio, 0, 0, width, height);
    mergeBuffer.context.globalAlpha = 1;
    mergeBuffer.context.drawImage(drawBuffer.canvas, 0, 0, width, height, 0, 0, width, height);
    ctx.drawImage(mergeBuffer.canvas, 0, 0, width, height, 0, 0, width, height);
}
exports.drawWithEdgeBlur = drawWithEdgeBlur;
//# sourceMappingURL=draw-with-blur.js.map