import { drawTriangle } from './draw-triangle';
import { drawQuad } from './draw-quad';
import { drawWithEdgeBlur } from './draw-with-blur';
import { drawWithShade } from './draw-with-shade';
import { DrawingBuffer, DrawingContext } from './drawing-buffer';
import { drawImagesAligned, RelativePosition, ImagePosition } from './draw-images-aligned';

const DEBUG = false;
const DEBUG_MOUSE = false;

const HANDLE_RADIUS = 0.1;
const DEFAULT_MOVE_HANDLE_RADIUS = 0.25;
const MAX_DRAG_DISTANCE_SQ = HANDLE_RADIUS * HANDLE_RADIUS;
// const MAX_MOVE_DISTANCE_SQ = DEFAULT_MOVE_HANDLE_RADIUS * DEFAULT_MOVE_HANDLE_RADIUS;
const TIME_REMOVE_HANDLES = 3000;

const MOVEMENT_RATIO = 0.5;

export enum ImageHandleKind {
    Stretch,
    RotateAndScale,
    Anchor,
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
    onMove?: (moveArgs: MoveArgs) => void;
    shouldMoveProductHandles?: boolean;
    moveHandleRadius?: number;
}

export interface MoveArgs {
    imageHandles: ImageHandles;
    imageHandles_old: ImageHandles;
    delta_productImageHandles: ImageHandles;
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

    x_bottom_left: number;
    x_bottom_right: number;
    x_top_left: number;
    x_top_right: number;
}

export interface TransformCell {
    source: Rect;
    target: SkewRect;
}

export function setupUserFitting(options: UserFittingOptions) {

    const shouldMoveProductHandles = options.shouldMoveProductHandles;
    const moveHandleRadius = options.moveHandleRadius || DEFAULT_MOVE_HANDLE_RADIUS;
    const MAX_MOVE_DISTANCE_SQ = moveHandleRadius * moveHandleRadius;

    options.productImageHandles = clone(options.productImageHandles);

    let cvs = document.createElement('canvas');
    options.host.appendChild(cvs);
    cvs.width = options.host.clientWidth;
    cvs.height = options.host.clientHeight;
    cvs.style.width = '100%';

    let w = cvs.width | 600;
    let h = cvs.height | 600;

    // // Oversize to be able to see better
    // if (DEBUG) {
    //     cvs.width = 1200;
    //     cvs.height = 800;

    //     w = 600;
    //     h = 600;
    // }

    let ctx = cvs.getContext('2d');

    if (DEBUG) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, w, h);
    }
    // TODO: Add Image Loader (for iOS)

    let userImage = new Image();
    userImage.onload = () => {

        // ctx.save();
        // ctx.globalAlpha = 0.15;
        // ctx.drawImage(userImage, 0, 0);
        // ctx.restore();
        // c.width = userImage.width;
        // c.height = userImage.height;

        refresh();
    };
    userImage.src = options.userImageUrl;

    let productImage = new Image();
    productImage.onload = () => {

        if (DEBUG) {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.drawImage(productImage, 0, 0);
            ctx.restore();
        }

        refresh();
    };
    productImage.src = options.productImageUrl;

    let productImage_adjusted: HTMLCanvasElement;

    let refresh = () => {
        if (!userImage.width || !productImage.width) {
            setTimeout(refresh, 250);
            return;
        }

        let c = { context: ctx, width: w || 600, height: h || 600 };

        // if (!DEBUG) {
        c.width = w = cvs.width;
        c.height = h = cvs.height;
        //}

        // Debug - Draw with shadows
        // if (productImage_adjusted == null) {

        //     let buffer = new DrawingBuffer(productImage.width, productImage.height);
        //     drawWithShade(buffer.context, productImage.width, productImage.height, '#000000', 0.15, ctx2 => {
        //         ctx2.drawImage(productImage, 0, 0, productImage.width, productImage.height);
        //     });

        //     productImage_adjusted = buffer.canvas;


        // }

        // // Resize for aspect ratio
        // if (productImage_adjusted == null) {

        //     // const aspectRatio = productImage.width / productImage.height;
        //     const aspectRatio = 1;

        //     let buffer = new DrawingBuffer(productImage.width, aspectRatio * productImage.height);
        //     // drawWithShade(buffer.context, productImage.width, productImage.height, '#000000', 0.15, ctx2 => {
        //     //     ctx2.drawImage(productImage, 0, 0, productImage.width, productImage.height);
        //     // });
        //     buffer.context.drawImage(productImage, 0, 0, productImage.width, productImage.height);
        //     productImage_adjusted = buffer.canvas;


        //     for (let key in options.productImageHandles) {
        //         if (options.productImageHandles.hasOwnProperty(key)) {
        //             const handle = options.productImageHandles[key];

        //             log('handle y before', handle.y, aspectRatio);
        //             handle.y = handle.y / aspectRatio;
        //             log('handle y after', handle.y, aspectRatio);
        //         }
        //     }
        // }

        // TODO: Re-implement dragging
        const actual = refreshUserFitting_simple(c, userImage, productImage, options, shouldDrawHandles);

        // if (!isDraggingNearest && !isMovingProduct) {
        // handles_move[0].x = actual.a.u;
        // handles_move[0].y = actual.a.v;
        // handles_move[1].x = actual.b.u;
        // handles_move[1].y = actual.b.v;
        // }

        // refreshUserFitting_simple(c, userImage, productImage_adjusted, options);

        if (shouldMoveProductHandles) {
            ctx.globalAlpha = 0.75;
            ctx.drawImage(productImage_adjusted, 0, 0, w, h);
            ctx.globalAlpha = 1;

            drawHandles(ctx, w, h, options.productImageHandles, '#FFFF00');
        }
    };

    setTimeout(refresh, 250);

    let handles_move: ImageHandle[] = [];

    if (!shouldMoveProductHandles) {
        for (let k in options.userImageHandles) {
            if (options.productImageHandles[k]) {
                handles_move.push(options.userImageHandles[k]);
            }
        }
    } else {
        // Move the product handles instead
        for (let k in options.userImageHandles) {
            if (options.productImageHandles[k]) {
                handles_move.push(options.productImageHandles[k]);
            }
        }
    }

    let getHandleInfo = (e: any) => {

        let rect = cvs.getBoundingClientRect();
        let xm = 0;
        let ym = 0;
        let xm2 = null as number;
        let ym2 = null as number;


        if (e.clientX != null) {
            xm = e.clientX - rect.left;
            ym = e.clientY - rect.top;
        } else if (e.touches != null) {
            xm = e.touches[0].clientX - rect.left;
            ym = e.touches[0].clientY - rect.top;

            if (e.touches[1]) {
                if (DEBUG_MOUSE) { console.log('2 FINGER'); }

                xm2 = e.touches[1].clientX - rect.left;
                ym2 = e.touches[1].clientY - rect.top;
            }
        }

        if (DEBUG_MOUSE) {
            console.log('Mouse Down', xm, ym, xm2, ym2, e);
        }
        let xh = xm / w;
        let yh = ym / h;
        let nearest = handles_move.map(s => ({ handle: s, distanceSq: (s.x - xh) * (s.x - xh) + (s.y - yh) * (s.y - yh) })).sort((a, b) => a.distanceSq - b.distanceSq)[0];
        let xh2 = xm2 ? xm2 / w : null;
        let yh2 = ym2 ? ym2 / h : null;


        return { xh, yh, nearest, xh2, yh2 };
    };


    let shouldDrawHandles = false;
    let isMovingProduct = false;
    let isDraggingNearest = false;
    let xh_start = 0;
    let yh_start = 0;
    let hNearest: ImageHandle = null;
    let xh2_start = 0;
    let yh2_start = 0;

    // let userHandles_old = clone(options.userImageHandles);
    // let productHandles_old = clone(options.productImageHandles);

    let dragEnd = () => {
        unsubscribe();
        isDraggingNearest = isMovingProduct = false;

        // // Report move
        // if (options.onMove) {

        //     const userHandles_new = clone(options.userImageHandles);
        //     const delta_productImageHandles = {} as ImageHandles;

        //     // for (let k in userHandles_new) {
        //     //     if (userHandles_new.hasOwnProperty(k)) {
        //     //         delta_productImageHandles[k] = 
        //     //     }
        //     // }

        //     options.onMove({
        //         imageHandles: userHandles_new,
        //         imageHandles_old: userHandles_old,
        //         delta_productImageHandles
        //     });

        //     userHandles_old = clone(options.userImageHandles);
        //     productHandles_old = clone(options.productImageHandles);
        // }
    };

    let dragStart = (e: any) => {
        subscribe();

        let {xh, yh, nearest, xh2, yh2} = getHandleInfo(e);

        xh_start = xh;
        yh_start = yh;
        xh2_start = xh2;
        yh2_start = yh2;

        handles_move.forEach(s => {
            s.x_start = s.x;
            s.y_start = s.y;

            s.nearestTouch = 0;
            if (xh2 != null) {
                let xhd = s.x - xh;
                let yhd = s.y - yh;
                let xhd2 = s.x - xh2;
                let yhd2 = s.y - yh2;
                if (xhd * xhd + yhd * yhd
                    > xhd2 * xhd2 + yhd2 * yhd2
                ) {
                    s.nearestTouch = 1;
                }
            }
        });

        if (nearest.distanceSq < MAX_DRAG_DISTANCE_SQ) {
            isDraggingNearest = true;
            hNearest = nearest.handle;
        } else if (nearest.distanceSq < MAX_MOVE_DISTANCE_SQ) {
            isMovingProduct = true;
        }

        if (DEBUG_MOUSE) {
            console.log('isDraggingPoint', isDraggingNearest, 'isMovingProduct', isMovingProduct);
            drawHandles(ctx, w, h, handles_move, '#00FF00');
            drawHandles(ctx, w, h, [nearest.handle], '#FF0000');
        }
    };

    let timeoutId = -1;

    let dragMove = (e: MouseEvent) => {
        if (!isDraggingNearest && !isMovingProduct) { return; }

        // Move the nearest handle
        let {xh, yh, nearest, xh2, yh2} = getHandleInfo(e);

        if (isDraggingNearest) {
            let s = hNearest;
            s.x = s.x_start + (xh - xh_start) * MOVEMENT_RATIO;
            s.y = s.y_start + (yh - yh_start) * MOVEMENT_RATIO;
        } else if (isMovingProduct) {
            handles_move.forEach(s => {

                let xhd = xh - xh_start;
                let yhd = yh - yh_start;
                let xhd2 = xh2 - xh2_start;
                let yhd2 = yh2 - yh2_start;

                if (xh2 == null) {
                    s.x = s.x_start + xhd * MOVEMENT_RATIO;
                    s.y = s.y_start + yhd * MOVEMENT_RATIO;
                } else {
                    // Each point moves with nearest finger
                    if (s.nearestTouch === 0) {
                        s.x = s.x_start + xhd * MOVEMENT_RATIO;
                        s.y = s.y_start + yhd * MOVEMENT_RATIO;
                    } else {
                        s.x = s.x_start + xhd2 * MOVEMENT_RATIO;
                        s.y = s.y_start + yhd2 * MOVEMENT_RATIO;
                    }
                }
            });

        }

        refresh();

        shouldDrawHandles = true;
        // drawHandles(ctx, w, h, handles_move, '#0000FF');
        // if (isDraggingNearest) {
        //     drawHandles(ctx, w, h, [hNearest], '#00FF00');
        // }
        // else {
        //     let xMain = handles_move.reduce((out, s) => out += s.x, 0) / handles_move.length;
        //     let yMain = handles_move.reduce((out, s) => out += s.y, 0) / handles_move.length;
        //     drawMainHandle(ctx, w, h, xMain, yMain, '#00FF00');
        // }

        let removeHandles = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (isDraggingNearest) { removeHandles(); return; }
                shouldDrawHandles = false;
                refresh();
            }, TIME_REMOVE_HANDLES);
        };

        removeHandles();

        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    cvs.addEventListener('mousedown', dragStart);
    cvs.addEventListener('touchstart', dragStart);

    const subscribe = () => {
        // console.log('subscribe');

        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('touchmove', dragMove, { passive: false } as any);
    };

    const unsubscribe = () => {
        // console.log('unsubscribe');

        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchend', dragEnd);
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('touchmove', dragMove);
    };
}

function log(message: any, ...args: any[]) {
    if (DEBUG) {
        console.log(message, ...args);
    }
}

function clone(obj: any) {
    const c = {} as any;
    for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
            if (typeof obj[k] === 'object') {
                c[k] = clone(obj[k]);
            } else {
                c[k] = obj[k];
            }
        }
    }

    return c;
}

function refreshUserFitting_simple(c: DrawingContext, userImage: HTMLImageElement, productImage: HTMLImageElement | HTMLCanvasElement, options: UserFittingOptions, shouldDrawHandles: boolean) {
    // log('refresh');

    c.context.clearRect(0, 0, c.width, c.height);
    const actualPosition = drawImagesAligned(c, [toSimpleImageInfo(userImage, options.userImageHandles), toSimpleImageInfo(productImage, options.productImageHandles)], shouldDrawHandles);
    return actualPosition;
}

function toSimpleImageInfo(image: HTMLImageElement | HTMLCanvasElement, imageHandles: ImageHandles): ImagePosition {
    const aHandle = imageHandles['left_temple'];
    const bHandle = imageHandles['right_temple'];

    return {
        image,
        a: { u: aHandle.x, v: aHandle.y },
        b: { u: bHandle.x, v: bHandle.y },
    };
}


function refreshUserFitting_old(c: DrawingContext, userImage: HTMLImageElement, productImage: HTMLImageElement | HTMLCanvasElement, options: UserFittingOptions) {
    log('refresh');

    c.context.clearRect(0, 0, c.width, c.height);
    c.context.drawImage(userImage, 0, 0, c.width, c.height);
    drawImageAligned(c, productImage, options.productImageHandles, options.userImageHandles);
}

function drawImageAligned(c: DrawingContext, image: HTMLImageElement | HTMLCanvasElement, handles: ImageHandles, handleTargets: ImageHandles) {
    let ctx = c.context;
    let w = c.width;
    let h = c.height;

    let handlesMerged: { source: ImageHandle, target: ImageHandle }[] = [];

    for (let k in handles) {
        handlesMerged.push({ source: handles[k], target: handleTargets[k] });
    }

    handlesMerged = handlesMerged.sort((a, b) => a.source.x - b.source.x);

    // Just do a row of cells for now (only vertical dividers)
    let handles_stretches = handlesMerged.filter(x => x.source.kind !== ImageHandleKind.Anchor);

    let gaps = handles_stretches.map((s, i) => ({ i: i, prev: s, next: handles_stretches[i + 1], xDistance: (handles_stretches[i + 1] || { source: { x: s.source.x } }).source.x - s.source.x }));
    gaps.sort((a, b) => b.xDistance - a.xDistance);
    log('gaps', gaps);

    let widest = gaps[0];

    let targetScale =
        (widest.next.target.x - widest.prev.target.x) /
        (widest.next.source.x - widest.prev.source.x);

    let y_delta_source = widest.next.source.y - widest.prev.source.y;
    let x_delta_source = widest.next.source.x - widest.prev.source.x;
    let y_delta_target = widest.next.target.y - widest.prev.target.y;
    let x_delta_target = widest.next.target.x - widest.prev.target.x;

    let sourceAngle = Math.atan(y_delta_source / x_delta_source);
    let targetAngle = Math.atan(y_delta_target / x_delta_target);
    let mainAngle = targetAngle - sourceAngle;

    // TEMP: Testing
    // mainAngle = 0;

    log('targetScale', targetScale,
        'y_delta_source', y_delta_source,
        'x_delta_source', x_delta_source,
        'y_delta_target', y_delta_target,
        'x_delta_target', x_delta_target,
        'sourceAngle', sourceAngle * 180 / Math.PI,
        'targetAngle', targetAngle * 180 / Math.PI,
        'mainAngle', mainAngle * 180 / Math.PI,
    );

    ctx.save();
    // ctx.rotate(mainAngle);

    // Calculate y_top and y_bottom for each stretch handle
    let stretches = handles_stretches.map(s => {
        let sourceLeft_yRatioFromTop = s.source.y;
        let sourceLeft_yRatioFromBottom = 1 - sourceLeft_yRatioFromTop;

        let targetTop = s.target.y - targetScale * sourceLeft_yRatioFromTop;
        let targetBottom = s.target.y + targetScale * sourceLeft_yRatioFromBottom;

        return {
            source: s.source,
            target_orig: s.target,
            target: s.target,
            x_top_target: s.target.x + rotateX(0, targetTop - s.target.y, mainAngle),
            x_bottom_target: s.target.x + rotateX(0, targetBottom - s.target.y, mainAngle),
            y_top_target: s.target.y + rotateY(0, targetTop - s.target.y, mainAngle),
            y_bottom_target: s.target.y + rotateY(0, targetBottom - s.target.y, mainAngle),

            // target: s.target,
            // x_top_target: s.target.x,
            // x_bottom_target: s.target.x,
            // y_top_target: targetTop,
            // y_bottom_target: targetBottom,

            // target: rotate(s.target, mainAngle),
            // x_top_target: rotateX(s.target.x, targetTop, mainAngle),
            // x_bottom_target: rotateX(s.target.x, targetBottom, mainAngle),
            // y_top_target: rotateY(s.target.x, targetTop, mainAngle),
            // y_bottom_target: rotateY(s.target.x, targetBottom, mainAngle),


            // target: rotate(s.target, -mainAngle),
            // x_top_target: rotateX(s.target.x, targetTop, -mainAngle),
            // x_bottom_target: rotateX(s.target.x, targetBottom, -mainAngle),
            // y_top_target: rotateY(s.target.x, targetTop, -mainAngle),
            // y_bottom_target: rotateY(s.target.x, targetBottom, -mainAngle),
            // y_top_target: targetTop,
            // y_bottom_target: targetBottom,
        };
    });


    let columnCount = stretches.length - 1;

    let grid: TransformCell[][] = [];

    gaps.reverse();
    let columnOrder: number[] = gaps.filter(g => g.xDistance > 0).map(g => g.i);

    for (let ic = 0; ic < columnCount; ic++) {

        let i = columnOrder[ic];
        let sourceTop = 0;
        let sourceBottom = 1;

        let left = stretches[i];
        let right = stretches[i + 1];

        let sourceLeft = left.source.x;
        let sourceRight = right.source.x;

        let targetLeft = left.target.x;
        let targetRight = right.target.x;

        let x_top_left_target = left.x_top_target;
        let x_bottom_left_target = left.x_bottom_target;
        let x_top_right_target = right.x_top_target;
        let x_bottom_right_target = right.x_bottom_target;

        // Calculate the y scale
        let y_top_left_target = left.y_top_target;
        let y_bottom_left_target = left.y_bottom_target;
        let y_top_right_target = right.y_top_target;
        let y_bottom_right_target = right.y_bottom_target;

        if (i === 0) {
            let changeRatio = (sourceRight - 0) / (sourceRight - sourceLeft);
            let targetPerSourceScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
            // targetLeft = targetRight - targetPerSourceScale * sourceRight;
            x_top_left_target = x_top_right_target - targetPerSourceScale * sourceRight;
            x_bottom_left_target = x_bottom_right_target - targetPerSourceScale * sourceRight;

            sourceLeft = 0;

            y_top_left_target = y_top_right_target - changeRatio * (y_top_right_target - y_top_left_target);
            y_bottom_left_target = y_bottom_right_target - changeRatio * (y_bottom_right_target - y_bottom_left_target);
        }

        if (i === columnCount - 1) {
            let changeRatio = (1 - sourceLeft) / (sourceRight - sourceLeft);
            let tScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
            // targetRight = targetLeft + tScale * (1 - sourceLeft);
            x_top_right_target = x_top_left_target + tScale * (1 - sourceLeft);
            x_bottom_right_target = x_bottom_left_target + tScale * (1 - sourceLeft);

            sourceRight = 1;

            y_top_right_target = y_top_left_target + changeRatio * (y_top_right_target - y_top_left_target);
            y_bottom_right_target = y_bottom_left_target + changeRatio * (y_bottom_right_target - y_bottom_left_target);
        }


        grid.push([{
            source: { x_left: sourceLeft, x_right: sourceRight, y_top: sourceTop, y_bottom: sourceBottom },
            target: {
                x_top_left: x_top_left_target, x_bottom_left: x_bottom_left_target, x_top_right: x_top_right_target, x_bottom_right: x_bottom_right_target,
                y_top_left: y_top_left_target, y_bottom_left: y_bottom_left_target, y_top_right: y_top_right_target, y_bottom_right: y_bottom_right_target
            }
        }]);


        let g = grid[grid.length - 1][0];

        log('Source:', g.source);
        log('Target:', g.target);


        // drawTriangle(ctx, image,
        //     w * g.source.x_left, h * g.source.y_top,
        //     w * g.source.x_right, h * g.source.y_top,
        //     w * g.source.x_left, h * g.source.y_bottom,
        //     image.width * g.source.x_left, image.height * g.source.y_top,
        //     image.width * g.source.x_right, image.height * g.source.y_top,
        //     image.width * g.source.x_left, image.height * g.source.y_bottom
        // );

        // drawTriangle(ctx, image,
        //     w * g.source.x_right, h * g.source.y_top,
        //     w * g.source.x_right, h * g.source.y_bottom,
        //     w * g.source.x_left, h * g.source.y_bottom,
        //     image.width * g.source.x_right, image.height * g.source.y_top,
        //     image.width * g.source.x_right, image.height * g.source.y_bottom,
        //     image.width * g.source.x_left, image.height * g.source.y_bottom
        // );

        // drawTriangle(ctx, image,
        //     w * g.target.x_left, h * g.target.y_top,
        //     w * g.target.x_right, h * g.target.y_top,
        //     w * g.target.x_left, h * g.target.y_bottom,
        //     image.width * g.target.x_left, image.height * g.target.y_top,
        //     image.width * g.target.x_right, image.height * g.target.y_top,
        //     image.width * g.target.x_left, image.height * g.target.y_bottom
        // );

        // drawTriangle(ctx, image,
        //     w * g.target.x_right, h * g.target.y_top,
        //     w * g.target.x_right, h * g.target.y_bottom,
        //     w * g.target.x_left, h * g.target.y_bottom,
        //     image.width * g.target.x_right, image.height * g.target.y_top,
        //     image.width * g.target.x_right, image.height * g.target.y_bottom,
        //     image.width * g.target.x_left, image.height * g.target.y_bottom
        // );

        // drawTriangle(ctx, image,
        //     w * g.target.x_left, h * g.target.y_top_left,
        //     w * g.target.x_right, h * g.target.y_top_right,
        //     w * g.target.x_left, h * g.target.y_bottom_left,
        //     image.width * g.source.x_left, image.height * g.source.y_top,
        //     image.width * g.source.x_right, image.height * g.source.y_top,
        //     image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG
        // );

        // drawTriangle(ctx, image,
        //     w * g.target.x_right, h * g.target.y_top_right,
        //     w * g.target.x_right, h * g.target.y_bottom_right,
        //     w * g.target.x_left, h * g.target.y_bottom_left,
        //     image.width * g.source.x_right, image.height * g.source.y_top,
        //     image.width * g.source.x_right, image.height * g.source.y_bottom,
        //     image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG
        // );

        drawWithEdgeBlur(ctx, w, h, (ctx2) => {
            drawQuad(ctx2, image,
                w * g.target.x_top_left, h * g.target.y_top_left,
                w * g.target.x_top_right, h * g.target.y_top_right,
                w * g.target.x_bottom_right, h * g.target.y_bottom_right,
                w * g.target.x_bottom_left, h * g.target.y_bottom_left,
                image.width * g.source.x_left, image.height * g.source.y_top,
                image.width * g.source.x_right, image.height * g.source.y_top,
                image.width * g.source.x_right, image.height * g.source.y_bottom,
                image.width * g.source.x_left, image.height * g.source.y_bottom,
                DEBUG
            );
        });

        // break;
    }

    if (DEBUG) {

        stretches.forEach(s => {
            log('draw stretch', s);
            ctx.beginPath();
            ctx.strokeStyle = '#FF00FF';
            ctx.moveTo(w * s.target_orig.x, h * s.target_orig.y);
            ctx.lineTo(w * s.target.x, h * s.target.y);
            ctx.stroke();
            // ctx.beginPath();
            // ctx.strokeStyle = '#00FFFF';
            // ctx.moveTo(w * s.target.x, h * s.target.x);
            // ctx.stroke();
        });

        drawHandles(ctx, w, h, stretches.map(s => s.target) as any as ImageHandles, '#FF00FF');
        drawHandles(ctx, w, h, handles, '#FF0000');
        drawHandles(ctx, w, h, handleTargets, '#00FF00');
        let xMain = stretches.reduce((out, s) => out += s.target.x, 0) / stretches.length;
        let yMain = stretches.reduce((out, s) => out += s.target.y, 0) / stretches.length;
        drawMainHandle(ctx, w, h, xMain, yMain, '#00FF00');
    }

    ctx.restore();
}

function rotate(handle: ImageHandle, angle: number): ImageHandle {
    let x_rotate = handle.x * Math.cos(angle) - handle.y * Math.sin(angle);
    let y_rotate = handle.x * Math.sin(angle) + handle.y * Math.cos(angle);

    return {
        kind: handle.kind,
        x: x_rotate,
        y: y_rotate,
    };
}

function rotateX(x: number, y: number, angle: number): number {
    let x_rotate = x * Math.cos(angle) - y * Math.sin(angle);
    return x_rotate;
}


function rotateY(x: number, y: number, angle: number): number {
    let y_rotate = x * Math.sin(angle) + y * Math.cos(angle);

    return y_rotate;
}

function calculateScale(s0: number, s1: number, t0: number, t1: number) {
    // if (s0 <= s1 || t0 <= t1) { return 0; }
    return (t1 - t0) / (s1 - s0);
}

function calculateSkewY(sx0: number, sx1: number, sy0: number, sy1: number, ty0: number, ty1: number) {
    let dsx = sx1 - sx0;
    let dsy = sy1 - sy0;
    let dty = ty1 - ty0;

    return (dty - dsy) / dsx;
}

function drawHandles(ctx: CanvasRenderingContext2D, w: number, h: number, handles: ImageHandles | ImageHandle[], color: string) {

    let radius = HANDLE_RADIUS * w;
    let thickness = 2;
    for (let k in handles) {
        log('draw handle');

        let handle = (handles as any)[k];
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;

        // ctx.beginPath();
        // ctx.moveTo(handle.x * w - radius, handle.y * h);
        // ctx.lineTo(handle.x * w + radius, handle.y * h);
        // ctx.stroke();

        // ctx.beginPath();
        // ctx.moveTo(handle.x * w, handle.y * h - radius);
        // ctx.lineTo(handle.x * w, handle.y * h + radius);
        // ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(handle.x * w, handle.y * h, radius * 0.25, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.globalAlpha = 1;
    }


}

function drawMainHandle(ctx: CanvasRenderingContext2D, w: number, h: number, x: number, y: number, color: string) {
    // ctx.beginPath();
    // ctx.globalAlpha = 1;
    // ctx.strokeStyle = color;
    // ctx.arc(x * w, y * h, MOVE_RADIUS * w, 0, Math.PI * 2, false);
    // //   ctx.arc(x * w, y * h, 0.01 * MOVE_RADIUS * w, 0, Math.PI * 2, false);
    // ctx.stroke();
    // ctx.globalAlpha = 1;
}

function drawImageSection(ctx: CanvasRenderingContext2D, image: HTMLImageElement, handle: ImageHandles, handleTargets: ImageHandles) {

}

