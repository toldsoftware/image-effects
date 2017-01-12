import * as S from '../src';

export function test() {
    console.log('test START');

    let host = document.createElement('div');
    document.body.appendChild(host);
    host.style.width = '300px';
    host.style.height = '300px';

    S.setupUserFitting({
        host: host,
        // productImageUrl: '/productImage.png',
        // productImageHandles: {
        //     center: { x: 300 / 600, y: 254 / 600, kind: S.ImageHandleKind.Move },
        //     left_temple: { x: 58 / 600, y: 246 / 600 },
        //     right_temple: { x: 544 / 600, y: 248 / 600 },
        //     left_earpiece: { x: 18 / 600, y: 280 / 600 },
        //     right_earpiece: { x: 583 / 600, y: 304 / 600 },
        // },
        productImageUrl: '/productImage02.png',
        productImageHandles: {
            center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Move },
            left_temple: { x: 58 / 600, y: 243 / 600 },
            right_temple: { x: 546 / 600, y: 251 / 600 },
            left_earpiece: { x: 10 / 600, y: 286 / 600 },
            right_earpiece: { x: 595 / 600, y: 294 / 600 },
        },
        // userImageUrl: '/userImage00.png',
        // userImageHandles: {
        //     center: { x: 302 / 600, y: 264 / 600, kind: S.ImageHandleKind.Move },
        //     left_temple: { x: 168 / 600, y: 260 / 600 },
        //     right_temple: { x: 438 / 600, y: 260 / 600 },
        //     left_earpiece: { x: 145 / 600, y: 278 / 600 },
        //     right_earpiece: { x: 460 / 600, y: 292 / 600 },
        // },
        // userImageUrl: '/userImage01.png',
        // userImageHandles: {
        //     center: { x: 97 / 220, y: 78 / 215, kind: S.ImageHandleKind.Move },
        //     left_temple: { x: 62 / 220, y: 74 / 215 },
        //     right_temple: { x: 133 / 220, y: 74 / 215 },
        //     left_earpiece: { x: 59 / 220, y: 83 / 215 },
        //     right_earpiece: { x: 138 / 220, y: 78 / 215 },
        // },
        userImageUrl: '/userImage02.jpg',
        userImageHandles: {
            center: { x: 286 / 600, y: 202 / 600, kind: S.ImageHandleKind.Move },
            left_temple: { x: 170 / 600, y: 217 / 600 },
            right_temple: { x: 406 / 600, y: 180 / 600 },
            left_earpiece: { x: 150 / 600, y: 255 / 600 },
            right_earpiece: { x: 425 / 600, y: 205 / 600 },
        },


    });

    console.log('test END');
}

test();