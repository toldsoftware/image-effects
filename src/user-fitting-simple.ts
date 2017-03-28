import { DrawingContext, DrawingBuffer } from './drawing-buffer';
import { drawImagesAligned, RelativePosition, RelativePoint, ImagePosition, getDistance, drawPoint } from './draw-images-aligned';

const DEBUG = false;

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
    // [key: string]: ImageHandle;
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
    onMove?: () => void;
}

export function setupUserFitting(options: UserFittingOptions) {
    let c = new DrawingBuffer(options.host.clientWidth || 600, options.host.clientHeight || 600);
    options.host.appendChild(c.canvas);
    c.canvas.style.width = '100%';

    // Load Images
    const userImage = new Image();
    userImage.onload = () => {
        refresh();
    };
    userImage.src = options.userImageUrl;

    const productImage = new Image();
    productImage.onload = () => {
        refresh();
    };
    productImage.src = options.productImageUrl;

    // Input Vars
    let shouldDrawHandles = false;
    let lastActualScale = 1;

    // Draw
    const refresh = () => {
        if (!userImage.width || !productImage.width) {
            setTimeout(refresh, 250);
            return;
        }

        c.context.clearRect(0, 0, options.host.clientWidth, options.host.clientHeight);
        const actual = drawImagesAligned(c, [toSimpleImageInfo(userImage, options.userImageHandles), toSimpleImageInfo(productImage, options.productImageHandles)], shouldDrawHandles);
        lastActualScale = actual.actualScale;
        return actual.actualPosition;
    };

    refresh();

    // Handle User Input
    if (options.isReadonly) { return; }

    handleUserInput(c, (drawHandles, positionChange) => {
        shouldDrawHandles = drawHandles;

        console.log('positionChange', positionChange, lastActualScale, userImage.width, c.width, userImage.height, c.height);

        if (!positionChange) {
            options.userImageHandles.left_temple.x_start = options.userImageHandles.left_temple.x;
            options.userImageHandles.left_temple.y_start = options.userImageHandles.left_temple.y;
            options.userImageHandles.right_temple.x_start = options.userImageHandles.right_temple.x;
            options.userImageHandles.right_temple.y_start = options.userImageHandles.right_temple.y;
        } else {

            options.userImageHandles.left_temple.x = options.userImageHandles.left_temple.x_start + positionChange.a.u; // * (userImage.width / c.width);
            options.userImageHandles.left_temple.y = options.userImageHandles.left_temple.y_start + positionChange.a.v * (userImage.width / userImage.height); // * (userImage.height / c.height);
            options.userImageHandles.right_temple.x = options.userImageHandles.right_temple.x_start + positionChange.b.u; // * (userImage.width / c.width);
            options.userImageHandles.right_temple.y = options.userImageHandles.right_temple.y_start + positionChange.b.v * (userImage.width / userImage.height); // * (userImage.height / c.height);
        }

        const result = refresh();

        if (DEBUG && positionChange) {
            drawPoint(c, { u: 0.5 + positionChange.a.u, v: 0.5 + positionChange.a.v }, '#0000FF');
            drawPoint(c, { u: 0.5 + positionChange.b.u, v: 0.5 + positionChange.b.v }, '#0000FF');
        }

        if (options.onMove) {
            options.onMove();
        }

        return result;
    });
}


function toSimpleImageInfo(image: HTMLImageElement | HTMLCanvasElement, imageHandles: ImageHandles): ImagePosition {
    const aHandle = imageHandles.left_temple;
    const bHandle = imageHandles.right_temple;

    return {
        image,
        a: { u: aHandle.x, v: aHandle.y },
        b: { u: bHandle.x, v: bHandle.y },
    };
}


function handleUserInput(c: DrawingContext, onChange: (shouldDrawHandles: boolean, positionChange: RelativePosition) => RelativePosition) {

    const MOVEMENT_RATIO = 0.5;

    const MAX_DRAG_RATIO = 0.25;
    const TIME_REMOVE_HANDLES = 3000;

    let lastActualPosition: RelativePosition = null;
    let isDraggingWhole = false;
    let isDraggingPoint = false;

    let start: PointInfo = null;
    let startPosition: RelativePosition = null;
    let shouldDrawHandles = false;

    let removeHandlesTimeoutId: number = null;

    const dragStart = (e: MouseEvent | TouchEvent) => {
        console.log('dragStart');

        if (!lastActualPosition) { lastActualPosition = onChange(shouldDrawHandles, null); }
        if (!lastActualPosition) { return; }

        startPosition = lastActualPosition;
        start = getPointInfo(e, c, [startPosition.a, startPosition.b]);
        shouldDrawHandles = true;

        // console.log('dragStart', e, lastActual, start);

        const nearest = start.nearest;
        if (!nearest) { return; }

        subscribe();

        const distance = getDistance(lastActualPosition);
        const maxMoveWholeDistanceSq = distance * distance;
        const maxMovePointDistanceSq = maxMoveWholeDistanceSq * MAX_DRAG_RATIO * MAX_DRAG_RATIO;

        if (nearest.distanceSq < maxMovePointDistanceSq) {
            isDraggingPoint = true;
        } else if (nearest.distanceSq < maxMoveWholeDistanceSq) {
            isDraggingWhole = true;
        }

        if (DEBUG) {
            setTimeout(() => {
                console.log('dragStart distance', distance);
                drawPoint(c, start, '#FF0000', c.width * Math.sqrt(nearest.distanceSq));
                drawPoint(c, start, '#FFFF00', c.width * Math.sqrt(maxMovePointDistanceSq));
                drawPoint(c, start, '#FF00FF', c.width * Math.sqrt(maxMoveWholeDistanceSq));
            }, 10);

            console.log('dragStart', isDraggingPoint, isDraggingWhole, nearest.distanceSq, maxMovePointDistanceSq, maxMoveWholeDistanceSq, e, lastActualPosition, start);
        }

        onChange(shouldDrawHandles, null);
    };

    const dragEnd = () => {
        console.log('dragEnd');

        unsubscribe();
        isDraggingPoint = isDraggingWhole = false;
    };

    const dragMove = (e: MouseEvent | TouchEvent) => {
        console.log('dragMove');

        if (!isDraggingPoint && !isDraggingWhole) { return; }

        shouldDrawHandles = true;

        // Move the nearest point
        let {u, v, u2, v2, nearest} = getPointInfo(e, c, [lastActualPosition.a, lastActualPosition.b]);

        const startPoint = start.nearest.index === 0 ? startPosition.a : startPosition.b;
        const newPoint = { u: 0, v: 0 };
        newPoint.u = (u - start.u) * MOVEMENT_RATIO;
        newPoint.v = (v - start.v) * MOVEMENT_RATIO;

        const newPoint2 = { u: 0, v: 0 };
        newPoint2.u = (u2 - start.u2) * MOVEMENT_RATIO;
        newPoint2.v = (v2 - start.v2) * MOVEMENT_RATIO;

        const positionChange = { a: { u: 0, v: 0 }, b: { u: 0, v: 0 } };

        if (isDraggingPoint) {
            if (start.nearest.index === 0) {
                positionChange.a = newPoint;
                positionChange.b = newPoint2;
            } else {
                positionChange.b = newPoint;
                positionChange.a = newPoint2;
            }
        } else if (isDraggingWhole) {
            positionChange.a = newPoint;
            positionChange.b = newPoint;
        }

        lastActualPosition = onChange(shouldDrawHandles, positionChange);


        let removeHandles = () => {
            clearTimeout(removeHandlesTimeoutId);
            removeHandlesTimeoutId = setTimeout(() => {
                if (isDraggingPoint) { removeHandles(); return; }
                shouldDrawHandles = false;
                onChange(shouldDrawHandles, null);
            }, TIME_REMOVE_HANDLES);
        };

        removeHandles();

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    };

    c.canvas.addEventListener('mousedown', dragStart);
    c.canvas.addEventListener('touchstart', dragStart);
    c.canvas.addEventListener('touchend', dragEnd);
    c.canvas.addEventListener('touchmove', dragMove);

    const subscribe = () => {
        // console.log('subscribe');
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', dragMove);
    };

    const unsubscribe = () => {
        // console.log('unsubscribe');
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('mousemove', dragMove);
    };
}

function getPointInfo(e: MouseEvent | TouchEvent, c: DrawingContext, points: RelativePoint[]) {

    const cvs = c.canvas;
    const w = c.width;
    const h = c.height;

    let rect = cvs.getBoundingClientRect();
    let xm = 0;
    let ym = 0;
    let xm2 = null as number;
    let ym2 = null as number;

    const eMouse = e as MouseEvent;
    const eTouch = e as TouchEvent;

    if (eMouse.clientX != null) {
        xm = eMouse.clientX - rect.left;
        ym = eMouse.clientY - rect.top;
    } else if (eTouch.touches != null) {
        xm = eTouch.touches[0].clientX - rect.left;
        ym = eTouch.touches[0].clientY - rect.top;

        if (eTouch.touches[1]) {
            xm2 = eTouch.touches[1].clientX - rect.left;
            ym2 = eTouch.touches[1].clientY - rect.top;
        }
    }

    let u = xm / w;
    let v = ym / h;
    let u2 = xm2 ? xm2 / w : null;
    let v2 = ym2 ? ym2 / h : null;
    let nearest = !points || !points.length ? null
        : points.map((p, i) => ({ point: p, index: i, distanceSq: (p.u - u) * (p.u - u) + (p.v - v) * (p.v - v) })).sort((a, b) => a.distanceSq - b.distanceSq)[0];


    // DEBUG
    if (DEBUG) {
        for (let p of points) {
            drawPoint(c, p, '#FFFF00', 4);
        }

        drawPoint(c, { u, v }, '#FF00FF', 4);
        if (u2) { drawPoint(c, { u: u2, v: v2 }, '#FF00FF', 4); }
        drawPoint(c, nearest.point, '#FF0000', 4);
    }

    return { u, v, u2, v2, nearest };
};

let tempPointInfo = (null as any) && getPointInfo(null, null, null);
type PointInfo = typeof tempPointInfo;