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
    left_temple: ImageHandle;
    right_temple: ImageHandle;
}
export interface UserFittingOptions {
    host: HTMLDivElement;
    userImageUrl: string;
    userImageHandles: ImageHandles;
    productImageUrl: string;
    productImageHandles: ImageHandles;
    moveHandleRadius?: number;
    isReadonly?: boolean;
}
export declare function setupUserFitting(options: UserFittingOptions): void;
