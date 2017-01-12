import { drawTriangle } from './draw-triangle';

export enum ImageHandleKind {
    Stretch,
    Move,
}
export interface ImageHandle {
    x: number;
    y: number;
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

    // Oversize to be able to see better
    cvs.width = 1200;
    cvs.height = 800;

    let w = 600;
    let h = 600;

    let ctx = cvs.getContext('2d');

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, w, h);

    // TODO: Add Image Loader (for iOS)

    let userImage = new Image();
    userImage.src = options.userImageUrl;
    userImage.onload = () => {

        // ctx.save();
        // ctx.globalAlpha = 0.15;
        // ctx.drawImage(userImage, 0, 0);
        // ctx.restore();
        // c.width = userImage.width;
        // c.height = userImage.height;

        refresh();
    };

    let productImage = new Image();
    productImage.src = options.productImageUrl;
    productImage.onload = () => {

        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.drawImage(productImage, 0, 0);
        ctx.restore();

        refresh();
    };

    let c = { context: ctx, width: w, height: h };
    let refresh = () => {



        refreshUserFitting(c, userImage, productImage, options);
    };

    setTimeout(refresh);

    cvs.onmousemove = () => refresh();
}


function refreshUserFitting(c: DrawContext, userImage: HTMLImageElement, productImage: HTMLImageElement, options: UserFittingOptions) {
    console.log('refresh');

    drawImage(c, userImage, options.userImageHandles, options.userImageHandles);
    drawImage(c, productImage, options.productImageHandles, options.userImageHandles);
}

function drawImage(c: DrawContext, image: HTMLImageElement, handles: ImageHandles, handleTargets: ImageHandles) {
    let ctx = c.context;
    let w = c.width;
    let h = c.height;

    let handlesMerged: { from: ImageHandle, to: ImageHandle }[] = [];

    for (let k in handles) {
        handlesMerged.push({ from: handles[k], to: handleTargets[k] });
    }

    handlesMerged = handlesMerged.sort((a, b) => a.from.x - b.from.x);

    // Just do a row of cells for now (only vertical dividers)
    let handles_stretches = handlesMerged.filter(x => x.from.kind !== ImageHandleKind.Move);

    let gaps = handles_stretches.map((s, i) => ({ prev: s, next: handles_stretches[i + 1], xDistance: (handles_stretches[i + 1] || { from: { x: s.from.x } }).from.x - s.from.x }));
    gaps.sort((a, b) => b.xDistance - a.xDistance);
    let widest = gaps[0];

    let targetScale =
        (widest.next.to.x - widest.prev.to.x) /
        (widest.next.from.x - widest.prev.from.x);

    console.log('targetScale', targetScale);


    // Calculate y_top and y_bottom for each stretch handle
    let stretches = handles_stretches.map(x => {
        let sourceLeft_yRatioFromTop = x.from.y;
        let sourceLeft_yRatioFromBottom = 1 - sourceLeft_yRatioFromTop;

        let targetTop = x.to.y - targetScale * sourceLeft_yRatioFromTop;
        let targetBottom = x.to.y + targetScale * sourceLeft_yRatioFromBottom;

        return {
            ...x,
            y_top_target: targetTop,
            y_bottom_target: targetBottom,
        };
    });


    let columnCount = stretches.length - 1;

    let grid: TransformCell[][] = [];

    for (let i = 0; i < columnCount; i++) {

        let sourceTop = 0;
        let sourceBottom = 1;

        let left = stretches[i];
        let right = stretches[i + 1];

        let sourceLeft = left.from.x;
        let sourceRight = right.from.x;

        let targetLeft = left.to.x;
        let targetRight = right.to.x;

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
            let changeRatio = (1 - sourceRight) / (sourceRight - sourceLeft);
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

        console.log('Source:', g.source);
        console.log('Target:', g.target);


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
            image.width * g.source.x_left, image.height * g.source.y_bottom,// false
        );

        drawTriangle(ctx, image,
            w * g.target.x_right, h * g.target.y_top_right,
            w * g.target.x_right, h * g.target.y_bottom_right,
            w * g.target.x_left, h * g.target.y_bottom_left,
            image.width * g.source.x_right, image.height * g.source.y_top,
            image.width * g.source.x_right, image.height * g.source.y_bottom,
            image.width * g.source.x_left, image.height * g.source.y_bottom,// false
        );

        // break;
    }

    // Match edges


    // for (let i = 0; i < grid.length; i++) {
    //     console.log('draw column');
    //     let column = grid[i];
    //     for (let j = 0; j < column.length; j++) {
    //         let cell = column[j];
    //         ctx.drawImage(image,
    //             image.width * cell.source.x_left,
    //             image.height * cell.source.x_right,
    //             image.width * (cell.source.x_right - cell.source.x_left),
    //             image.height * (cell.source.y_bottom - cell.source.y_top),
    //             image.width * cell.target.x_left,
    //             image.height * cell.target.y_top,
    //             image.width * (cell.target.x_right - cell.target.x_left),
    //             image.height * (cell.target.y_bottom - cell.target.y_top)
    //         );

    //         console.log(image,
    //             '\n',
    //             's_x', cell.source.x_left,
    //             's_y', cell.source.x_right,
    //             's_w', (cell.source.x_right - cell.source.x_left),
    //             's_h', (cell.source.y_bottom - cell.source.y_top),
    //             '\n',
    //             't_x', cell.target.x_left,
    //             't_y', cell.target.y_top,
    //             't_w', (cell.target.x_right - cell.target.x_left),
    //             't_h', (cell.target.y_bottom - cell.target.y_top)
    //         );

    //     }

    //     // TESTING
    //     // break;
    // }

    // ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, w, h);

    drawHandles(ctx, w, h, handles, '#FF0000');
    drawHandles(ctx, w, h, handleTargets, '#00FF00');
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

function drawHandles(ctx: CanvasRenderingContext2D, w: number, h: number, handles: ImageHandles, color: string) {
    const len = 10;
    for (let k in handles) {
        console.log('draw handle');

        let handle = handles[k];
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.moveTo(handle.x * w - len, handle.y * h);
        ctx.lineTo(handle.x * w + len, handle.y * h);
        ctx.moveTo(handle.x * w, handle.y * h - len);
        ctx.lineTo(handle.x * w, handle.y * h + len);
        ctx.stroke();
    }


}

function drawImageSection(ctx: CanvasRenderingContext2D, image: HTMLImageElement, handle: ImageHandles, handleTargets: ImageHandles) {

}

