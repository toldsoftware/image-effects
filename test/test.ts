import * as S from '../src';

export function test() {
    console.log('test START');

    let p0 = getProduct(0);
    let p1 = getProduct(1);
    let u0 = getUser(0);
    let u1 = getUser(1);
    let u2 = getUser(2);

    addTest(p0, u0);
    addTest(p0, u1);
    addTest(p0, u2);

    addTest(p1, u0);
    addTest(p1, u1);
    addTest(p1, u2);

    console.log('test END');
}

function addTest(product: any, user: any) {
    let host = document.createElement('div');
    document.body.appendChild(host);
    host.style.width = '300px';
    host.style.height = '300px';
    host.style.display = 'inline-block';

    S.setupUserFitting({
        host: host,
        userImageUrl: user.userImageUrl,
        userImageHandles: user.userImageHandles,
        productImageUrl: product.productImageUrl,
        productImageHandles: product.productImageHandles
    });
}

function getProduct(i: number) {
    if (i === 0) {
        return {
            productImageUrl: '/productImage.png',
            productImageHandles: {
                center: { x: 300 / 600, y: 254 / 600, kind: S.ImageHandleKind.Anchor },
                left_temple: { x: 58 / 600, y: 246 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 544 / 600, y: 248 / 600, kind: S.ImageHandleKind.RotateAndScale },
                left_earpiece: { x: 18 / 600, y: 280 / 600 },
                right_earpiece: { x: 583 / 600, y: 304 / 600 },
            },
        };
    } else {
        return {
            productImageUrl: '/productImage02.png',
            productImageHandles: {
                center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
                left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
                left_earpiece: { x: 10 / 600, y: 286 / 600 },
                right_earpiece: { x: 595 / 600, y: 294 / 600 },
            },
        };
    }
}

function getUser(i: number) {
    if (i === 0) {
        return {
            userImageUrl: '/userImage00.png',
            userImageHandles: {
                left_temple: { x: 168 / 600, y: 260 / 600 },
                right_temple: { x: 438 / 600, y: 260 / 600 },
                left_earpiece: { x: 145 / 600, y: 278 / 600 },
                right_earpiece: { x: 460 / 600, y: 292 / 600 },
            },
        };
    } else if (i === 1) {
        return {
            userImageUrl: '/userImage01.png',
            userImageHandles: {
                left_temple: { x: 62 / 220, y: 78 / 215 },
                right_temple: { x: 135 / 220, y: 78 / 215 },
                left_earpiece: { x: 59 / 220, y: 83 / 215 },
                right_earpiece: { x: 138 / 220, y: 78 / 215 },
            },
        };
    } else {
        return {
            userImageUrl: '/userImage02.jpg',
            userImageHandles: {
                left_temple: { x: 170 / 600, y: 217 / 600 },
                right_temple: { x: 406 / 600, y: 184 / 600 },
                left_earpiece: { x: 150 / 600, y: 255 / 600 },
                right_earpiece: { x: 425 / 600, y: 205 / 600 },
            },
        };
    }
}

test();