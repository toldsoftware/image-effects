import { DrawingBuffer } from './drawing-buffer';

let drawBuffer: DrawingBuffer;

// Draw edge blur by downsampling image to half size, drawing that first and then drawing sharp image on top
export function drawWithShade(ctx: CanvasRenderingContext2D, width: number, height: number, color: string, alpha: number, draw: (ctx: CanvasRenderingContext2D) => void) {

    if (drawBuffer == null) { drawBuffer = new DrawingBuffer(width, height); }
    drawBuffer.clear(width, height);

    draw(drawBuffer.context);
    drawBuffer.context.globalAlpha = alpha;
    drawBuffer.context.fillStyle = color;
    drawBuffer.context.fillRect(0, 0, width, height);
    drawBuffer.context.globalAlpha = 1;
    ctx.drawImage(drawBuffer.canvas, 0, 0, width, height, 0, 0, width, height);
}