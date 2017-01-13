import { DrawingBuffer } from './drawing-buffer';

let drawBuffer: DrawingBuffer;
let blurBuffer: DrawingBuffer;
let mergeBuffer: DrawingBuffer;

// Draw edge blur by downsampling image to half size, drawing that first and then drawing sharp image on top
export function drawWithEdgeBlur(ctx: CanvasRenderingContext2D, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {

    let downsample_ratio = 0.5;
    let downsample_alpha = 0.5;

    if (drawBuffer == null) { drawBuffer = new DrawingBuffer(width, height); }
    drawBuffer.clear(width, height);

    if (blurBuffer == null) { blurBuffer = new DrawingBuffer(width * downsample_ratio, height * downsample_ratio); }
    blurBuffer.clear(width * downsample_ratio, height * downsample_ratio);

    if (mergeBuffer == null) { mergeBuffer = new DrawingBuffer(width, height); }
    mergeBuffer.clear(width, height);

    draw(drawBuffer.context);
    blurBuffer.context.drawImage(drawBuffer.canvas, 0, 0, width, height, 0, 0, width * downsample_ratio, height * downsample_ratio);
    mergeBuffer.context.globalAlpha = downsample_alpha;
    mergeBuffer.context.drawImage(blurBuffer.canvas, 0, 0, width * downsample_ratio, height * downsample_ratio, 0, 0, width, height);
    mergeBuffer.context.globalAlpha = 1;
    mergeBuffer.context.drawImage(drawBuffer.canvas, 0, 0, width, height, 0, 0, width, height);
    ctx.drawImage(mergeBuffer.canvas, 0, 0, width, height, 0, 0, width, height);
}