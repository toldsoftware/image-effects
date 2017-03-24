import { DrawingContext } from './drawing-buffer';
export interface RelativePoint {
    u: number;
    v: number;
}
export interface RelativePosition {
    a: RelativePoint;
    b: RelativePoint;
}
export interface ImagePosition extends RelativePosition {
    image: HTMLImageElement | HTMLCanvasElement;
}
export declare function drawImagesAligned(cOrig: DrawingContext, images: ImagePosition[], shouldDrawPosition: boolean): RelativePosition;
