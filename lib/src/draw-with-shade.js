"use strict";
var drawing_buffer_1 = require("./drawing-buffer");
var drawBuffer;
// Draw edge blur by downsampling image to half size, drawing that first and then drawing sharp image on top
function drawWithShade(ctx, width, height, color, alpha, draw) {
    if (drawBuffer == null) {
        drawBuffer = new drawing_buffer_1.DrawingBuffer(width, height);
    }
    drawBuffer.clear(width, height);
    draw(drawBuffer.context);
    drawBuffer.context.globalAlpha = alpha;
    drawBuffer.context.fillStyle = color;
    drawBuffer.context.fillRect(0, 0, width, height);
    drawBuffer.context.globalAlpha = 1;
    ctx.drawImage(drawBuffer.canvas, 0, 0, width, height, 0, 0, width, height);
}
exports.drawWithShade = drawWithShade;
//# sourceMappingURL=draw-with-shade.js.map