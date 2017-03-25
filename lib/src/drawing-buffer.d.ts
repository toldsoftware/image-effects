export interface DrawingContext {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}
export declare class DrawingBuffer implements DrawingContext {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor(width: number, height: number);
    clear(width: number, height: number): void;
}
