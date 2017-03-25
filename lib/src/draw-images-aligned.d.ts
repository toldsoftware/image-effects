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
export declare function drawImagesAligned(cOrig: DrawingContext, images: ImagePosition[], shouldDrawPosition: boolean): {
    actualPosition: {
        a: {
            u: number;
            v: number;
        };
        b: {
            u: number;
            v: number;
        };
    };
    actualScale: number;
};
export declare function drawPosition(c: DrawingContext, position: RelativePosition): void;
export declare function drawPoint(c: DrawingContext, point: RelativePoint, color?: string, radius?: number): void;
export declare function getDistance(position: RelativePosition): number;
