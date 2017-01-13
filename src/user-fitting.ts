import { drawTriangle } from './draw-triangle';

const DEBUG = false;
const DEBUG_MOUSE = false;

const MAX_DRAG_DISTANCE_SQ = 0.05 * 0.05;
const MAX_MOVE_DISTANCE_SQ = 0.25 * 0.25;
const TIME_REMOVE_HANDLES = 3000;
const HANDLE_RADIUS = 4;

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

interface DrawContext {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
}


export function setupUserFitting(options: UserFittingOptions) {
    let cvs = document.createElement('canvas');
    options.host.appendChild(cvs);
    cvs.width = options.host.clientWidth;
    cvs.height = options.host.clientHeight;

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


    let refresh = () => {
        if (!userImage.width || !productImage.width) {
            setTimeout(refresh, 250);
            return;
        }

        let c = { context: ctx, width: w || 600, height: h || 600 };

        if (!DEBUG) {
            c.width = w = cvs.width;
            c.height = h = cvs.height;
        }

        refreshUserFitting(c, userImage, productImage, options);
    };

    setTimeout(refresh, 250);

    let userHandles: ImageHandle[] = [];

    for (let k in options.userImageHandles) {
        userHandles.push(options.userImageHandles[k]);
    }

    let getHandleInfo = (e: any) => {

        let rect = cvs.getBoundingClientRect();
        let xm = 0;
        let ym = 0;

        if (e.clientX != null) {
            xm = e.clientX - rect.left;
            ym = e.clientY - rect.top;
        } else if (e.touches != null) {
            xm = e.touches[0].clientX - rect.left;
            ym = e.touches[0].clientY - rect.top;
        }

        if (DEBUG_MOUSE) {
            console.log('Mouse Down', xm, ym, e);
        }
        let xh = xm / w;
        let yh = ym / h;
        let nearest = userHandles.map(s => ({ handle: s, distanceSq: (s.x - xh) * (s.x - xh) + (s.y - yh) * (s.y - yh) })).sort((a, b) => a.distanceSq - b.distanceSq)[0];

        return { xh, yh, nearest };
    };


    let isMovingProduct = false;
    let isDraggingNearest = false;
    let xh_start = 0;
    let yh_start = 0;
    let hNearest: ImageHandle = null;

    let dragEnd = () => isDraggingNearest = isMovingProduct = false;
    let dragStart = (e: any) => {
        let {xh, yh, nearest} = getHandleInfo(e);

        xh_start = xh;
        yh_start = yh;

        userHandles.forEach(s => {
            s.x_start = s.x;
            s.y_start = s.y;
        });

        if (nearest.distanceSq < MAX_DRAG_DISTANCE_SQ) {
            isDraggingNearest = true;
            hNearest = nearest.handle;
        } else if (nearest.distanceSq < MAX_MOVE_DISTANCE_SQ) {
            isMovingProduct = true;
        }

        if (DEBUG_MOUSE) {
            console.log('isDraggingPoint', isDraggingNearest, 'isMovingProduct', isMovingProduct);
            drawHandles(ctx, w, h, userHandles, '#00FF00');
            drawHandles(ctx, w, h, [nearest.handle], '#FF0000');
        }
    };

    let timeoutId = -1;

    let dragMove = (e: any) => {
        if (!isDraggingNearest && !isMovingProduct) { return; }

        // Move the nearest handle
        let {xh, yh} = getHandleInfo(e);

        if (isDraggingNearest) {
            let s = hNearest;
            s.x = s.x_start + (xh - xh_start) * MOVEMENT_RATIO;
            s.y = s.y_start + (yh - yh_start) * MOVEMENT_RATIO;
        } else if (isMovingProduct) {
            userHandles.forEach(s => {
                s.x = s.x_start + (xh - xh_start) * MOVEMENT_RATIO;
                s.y = s.y_start + (yh - yh_start) * MOVEMENT_RATIO;
            });
        }

        refresh();

        // if (DEBUG_MOUSE) {
        drawHandles(ctx, w, h, userHandles, '#0000FF');
        if (isDraggingNearest) {
            drawHandles(ctx, w, h, [hNearest], '#00FF00');
        }
        // }

        let removeHandles = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (isDraggingNearest) { removeHandles(); return; }
                refresh();
            }, TIME_REMOVE_HANDLES);
        };

        removeHandles();

        e.preventDefault();
        return false;
    };

    cvs.addEventListener('mousedown', dragStart);
    cvs.addEventListener('touchstart', dragStart);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove);
}

function log(message: any, ...args: any[]) {
    if (DEBUG) {
        console.log(message, ...args);
    }
}


function refreshUserFitting(c: DrawContext, userImage: HTMLImageElement, productImage: HTMLImageElement, options: UserFittingOptions) {
    log('refresh');

    drawImage(c, userImage, options.userImageHandles, options.userImageHandles);
    drawImage(c, productImage, options.productImageHandles, options.userImageHandles);
}

function drawImage(c: DrawContext, image: HTMLImageElement, handles: ImageHandles, handleTargets: ImageHandles) {
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
    // log('gaps', gaps);

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
    ctx.rotate(mainAngle);

    // Calculate y_top and y_bottom for each stretch handle
    let stretches = handles_stretches.map(s => {
        let sourceLeft_yRatioFromTop = s.source.y;
        let sourceLeft_yRatioFromBottom = 1 - sourceLeft_yRatioFromTop;

        let targetTop = s.target.y - targetScale * sourceLeft_yRatioFromTop;
        let targetBottom = s.target.y + targetScale * sourceLeft_yRatioFromBottom;

        return {
            source: s.source,
            target_orig: s.target,
            target: rotate(s.target, -mainAngle),
            y_top_target: rotateY(s.target.x, targetTop, -mainAngle),
            y_bottom_target: rotateY(s.target.x, targetBottom, -mainAngle),
        };
    });


    let columnCount = stretches.length - 1;

    let grid: TransformCell[][] = [];

    gaps.reverse();
    let columnOrder: number[] = gaps.filter(g => g.xDistance > 0).map(g => g.i);

    for (let ico = 0; ico < columnCount; ico++) {

        let i = columnOrder[ico];
        let sourceTop = 0;
        let sourceBottom = 1;

        let left = stretches[i];
        let right = stretches[i + 1];

        let sourceLeft = left.source.x;
        let sourceRight = right.source.x;

        let targetLeft = left.target.x;
        let targetRight = right.target.x;

        // Calculate the y scale
        let target_top_left = left.y_top_target;
        let target_bottom_left = left.y_bottom_target;

        let target_top_right = right.y_top_target;
        let target_bottom_right = right.y_bottom_target;

        if (i === 0) {
            let changeRatio = (sourceRight - 0) / (sourceRight - sourceLeft);
            let targetPerSourceScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
            targetLeft = targetRight - targetPerSourceScale * sourceRight;
            sourceLeft = 0;

            target_top_left = target_top_right - changeRatio * (target_top_right - target_top_left);
            target_bottom_left = target_bottom_right - changeRatio * (target_bottom_right - target_bottom_left);
        }

        if (i === columnCount - 1) {
            let changeRatio = (1 - sourceLeft) / (sourceRight - sourceLeft);
            let tScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
            targetRight = targetLeft + tScale * (1 - sourceLeft);
            sourceRight = 1;

            target_top_right = target_top_left + changeRatio * (target_top_right - target_top_left);
            target_bottom_right = target_bottom_left + changeRatio * (target_bottom_right - target_bottom_left);
        }


        grid.push([{
            source: { x_left: sourceLeft, x_right: sourceRight, y_top: sourceTop, y_bottom: sourceBottom },
            target: { x_left: targetLeft, x_right: targetRight, y_top_left: target_top_left, y_bottom_left: target_bottom_left, y_top_right: target_top_right, y_bottom_right: target_bottom_right }
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

        drawTriangle(ctx, image,
            w * g.target.x_left, h * g.target.y_top_left,
            w * g.target.x_right, h * g.target.y_top_right,
            w * g.target.x_left, h * g.target.y_bottom_left,
            image.width * g.source.x_left, image.height * g.source.y_top,
            image.width * g.source.x_right, image.height * g.source.y_top,
            image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG
        );

        drawTriangle(ctx, image,
            w * g.target.x_right, h * g.target.y_top_right,
            w * g.target.x_right, h * g.target.y_bottom_right,
            w * g.target.x_left, h * g.target.y_bottom_left,
            image.width * g.source.x_right, image.height * g.source.y_top,
            image.width * g.source.x_right, image.height * g.source.y_bottom,
            image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG
        );

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

    let radius = HANDLE_RADIUS;
    for (let k in handles) {
        log('draw handle');

        let handle = (handles as any)[k];
        ctx.beginPath();
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = color;
        // ctx.moveTo(handle.x * w - len, handle.y * h);
        // ctx.lineTo(handle.x * w + len, handle.y * h);
        // ctx.moveTo(handle.x * w, handle.y * h - len);
        // ctx.lineTo(handle.x * w, handle.y * h + len);
        // ctx.stroke();

        ctx.fillStyle = color;
        ctx.arc(handle.x * w, handle.y * h, radius, 0, Math.PI * 2, false);
        ctx.fill();
    }


}

function drawImageSection(ctx: CanvasRenderingContext2D, image: HTMLImageElement, handle: ImageHandles, handleTargets: ImageHandles) {

}

