const DEBUG = false;

export interface DrawingContext {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
}

export class DrawingBuffer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');

        if (DEBUG) {
            document.body.appendChild(this.canvas);
        }
    }

    clear(width: number, height: number) {
        if (this.canvas.width !== width) {
            this.canvas.width = width;
            this.canvas.height = height;
        }

        this.context.clearRect(0, 0, width, height);
    }
}