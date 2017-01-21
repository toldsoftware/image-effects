export declare enum ImageHandleKind {
    Stretch = 0,
    RotateAndScale = 1,
    Anchor = 2,
}
export interface ImageHandle {
    x: number;
    y: number;
    x_start?: number;
    y_start?: number;
    nearestTouch?: number;
    kind?: ImageHandleKind;
}
export interface ImageHandles {
    [key: string]: ImageHandle;
}
export interface UserFittingOptions {
    host: HTMLDivElement;
    userImageUrl: string;
    userImageHandles: ImageHandles;
    productImageUrl: string;
    productImageHandles: ImageHandles;
}
export interface Rect {
    y_top: number;
    y_bottom: number;
    x_left: number;
    x_right: number;
}
export interface SkewRect {
    y_top_left: number;
    y_bottom_left: number;
    y_top_right: number;
    y_bottom_right: number;
    x_left: number;
    x_right: number;
}
export interface TransformCell {
    source: Rect;
    target: SkewRect;
}
export declare function setupUserFitting(options: UserFittingOptions): void;
