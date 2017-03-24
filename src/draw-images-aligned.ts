import { DrawingContext, DrawingBuffer } from './drawing-buffer';
import { drawWithEdgeBlur } from './draw-with-blur';

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

const buffer = new DrawingBuffer(1200, 1200);

export function drawImagesAligned(cOrig: DrawingContext, images: ImagePosition[], shouldDrawPosition: boolean): RelativePosition {

    // Anti-alias by drawing at a higher scale and resizing after merging
    // const scale = 600 / cOrig.width;
    const scale = 2;
    const wBuffer = scale * cOrig.width;
    const hBuffer = scale * cOrig.height;
    buffer.clear(wBuffer, hBuffer);

    const c = { context: buffer.context, width: wBuffer, height: hBuffer };

    // Draw the main image and get it's actual position
    const mainImage = images[0];
    const mainPosition = drawImageCentered(c, mainImage);

    // Draw each image
    for (let i = 0; i < images.length; i++) {
        if (i === 0) { continue; }

        drawImageAligned(c, images[i], mainPosition);
    }

    if (shouldDrawPosition) { drawPosition(c, mainPosition); }

    // Resize
    cOrig.context.drawImage(buffer.canvas, 0, 0, wBuffer, hBuffer, 0, 0, cOrig.width, cOrig.height);

    const actualPosition = {
        a: {
            u: mainPosition.a.u / scale,
            v: mainPosition.a.v / scale,
        },
        b: {
            u: mainPosition.b.u / scale,
            v: mainPosition.b.v / scale,
        }
    };

    return actualPosition;
}

function drawImageCentered(c: DrawingContext, image: ImagePosition): RelativePosition {
    const w = c.width;
    const h = c.height;

    const wImage = image.image.width;
    const hImage = image.image.height;

    const wScale = w / wImage;
    const hScale = h / hImage;

    // Fill
    // const scale = Math.max(wScale, hScale);

    // Fit Inside
    const scale = Math.min(wScale, hScale);

    // const scale = 1;

    const x = 0.5 * (w - scale * wImage);
    const y = 0.5 * (h - scale * hImage);

    c.context.drawImage(image.image,
        0, 0, wImage, hImage,
        x, y, scale * wImage, scale * hImage
    );

    const mainPosition = {
        a: {
            u: (x + image.a.u * wImage * scale) / w,
            v: (y + image.a.v * hImage * scale) / h,
        },
        b: {
            u: (x + image.b.u * wImage * scale) / w,
            v: (y + image.b.v * hImage * scale) / h,
        },
    };

    return mainPosition;
}

function drawPosition(c: DrawingContext, position: RelativePosition) {
    drawPoint(c, position.a);
    drawPoint(c, position.b);
}

function drawPoint(c: DrawingContext, point: RelativePoint) {
    const ctx = c.context;
    const w = c.width;
    const h = c.height;

    const color = '#00FF00';
    const radius = 16;
    const thickness = 2;

    const u = point.u;
    const v = point.v;

    ctx.globalAlpha = 0.5;
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;

    // ctx.beginPath();
    // ctx.moveTo(u * w - radius, v * h);
    // ctx.lineTo(u * w + radius, v * h);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(u * w, v * h - radius);
    // ctx.lineTo(u * w, v * h + radius);
    // ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(u * w, v * h, radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawImageAligned(c: DrawingContext, image: ImagePosition, position: RelativePosition) {
    const uAxis = (position.a.u + position.b.u) * 0.5;
    const vAxis = (position.a.v + position.b.v) * 0.5;

    const uAxis_image = (image.a.u + image.b.u) * 0.5;
    const vAxis_image = (image.a.v + image.b.v) * 0.5;

    const ctx = c.context;
    const w = c.width;
    const h = c.height;

    const wImage = image.image.width;
    const hImage = image.image.height;


    const posDistance = getDistance(position);
    const imageDistance = getDistance(image);
    const uvScale = posDistance / imageDistance;
    const scale = uvScale * w / wImage;

    // console.log('distance', posDistance, imageDistance, scale, w, h, wImage, hImage);

    const posAngle = getAngle(position);
    const imageAngle = getAngle(image);
    const angle = posAngle - imageAngle;

    const xAxis = w * uAxis;
    const yAxis = h * vAxis;

    const xImage = xAxis - uAxis_image * scale * wImage;
    const yImage = yAxis - vAxis_image * scale * hImage;

    ctx.save();

    ctx.translate(uAxis * w, vAxis * h);
    ctx.rotate(angle);
    ctx.translate(-uAxis * w, -vAxis * h);

    // ctx.drawImage(image.image,
    //     0, 0, wImage, hImage,
    //     xImage, yImage, scale * wImage, scale * hImage
    // );

    drawWithEdgeBlur(ctx, w, h, ctx2 => {
        ctx2.drawImage(image.image,
            0, 0, wImage, hImage,
            xImage, yImage, scale * wImage, scale * hImage
        );
    });

    ctx.restore();

}

function getDistance(position: RelativePosition): number {
    const uDelta = position.a.u - position.b.u;
    const vDelta = position.a.v - position.b.v;
    return Math.sqrt(uDelta * uDelta + vDelta * vDelta);
}

function getAngle(position: RelativePosition): number {
    const uDelta = position.a.u - position.b.u;
    const vDelta = position.a.v - position.b.v;
    return Math.atan(vDelta / uDelta);
}