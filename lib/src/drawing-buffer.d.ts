export declare class DrawingBuffer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(width: number, height: number);
    clear(width: number, height: number): void;
}