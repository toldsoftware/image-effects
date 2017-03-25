const DEBUG = false;

export interface DrawingContext {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

export class DrawingBuffer implements DrawingContext {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
        this.context = this.canvas.getContext('2d');

        if (DEBUG) {
            document.body.appendChild(this.canvas);
        }
    }

    clear(width: number, height: number) {
        if (this.canvas.width !== width) {
            this.width = this.canvas.width = width;
            this.height = this.canvas.height = height;
        }

        this.context.clearRect(0, 0, width, height);
    }
}