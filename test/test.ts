import * as S from '../src/index';

export function test() {
    console.log('test START');

    let p0 = getProduct(0);
    let p1 = getProduct(1);
    let p2 = getProduct(2);
    let p3 = getProduct(3);
    let p4 = getProduct(4);
    let p5 = getProduct(5);
    let u0 = getUser(0);
    let u1 = getUser(1);
    let u2 = getUser(2);
    let u3 = getUser(3);
    let u4 = getUser(4);

    // addTest(p1, { userImageUrl: p0.productImageUrl, userImageHandles: p0.productImageHandles });

    addTest(p0, { userImageUrl: p1.productImageUrl, userImageHandles: p1.productImageHandles }, 1);
    addTest(p0, { userImageUrl: p2.productImageUrl, userImageHandles: p2.productImageHandles }, 1);
    addTest(p0, { userImageUrl: p3.productImageUrl, userImageHandles: p3.productImageHandles }, 1);
    addTest(p0, { userImageUrl: p4.productImageUrl, userImageHandles: p4.productImageHandles }, 1);
    addTest(p0, { userImageUrl: p5.productImageUrl, userImageHandles: p5.productImageHandles }, 1);

    addTest(p0, u0);
    addTest(p0, u1);
    addTest(p0, u2);
    addTest(p0, u3);
    addTest(p0, u4);

    addTest(p1, u0);
    addTest(p1, u1);
    addTest(p1, u2);
    addTest(p1, u3);
    addTest(p1, u4);

    addTest(p2, u0);
    addTest(p2, u1);
    addTest(p2, u2);
    addTest(p2, u3);
    addTest(p2, u4);

    addTest(p3, u0);
    addTest(p3, u1);
    addTest(p3, u2);
    addTest(p3, u3);
    addTest(p3, u4);

    addTest(p4, u0);
    addTest(p4, u1);
    addTest(p4, u2);
    addTest(p4, u3);
    addTest(p4, u4);

    addTest(p5, u0);
    addTest(p5, u1);
    addTest(p5, u2);
    addTest(p5, u3);
    addTest(p5, u4);

    let productJsonObj = { ...p1.productImageHandles };
    delete ((productJsonObj as any)['center']);
    console.log('product json', JSON.stringify(productJsonObj));

    let userJsonObj = { ...u0.userImageHandles };
    console.log('user json', JSON.stringify(userJsonObj));

    console.log('test END');
}

function addTest(product: any, user: any, moveHandleRadius = 0.25, shouldMoveProductHandles = false) {
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
        productImageHandles: product.productImageHandles,
        // shouldMoveProductHandles,
        moveHandleRadius
    });
}


function getProduct(i: number) {
    if (i === 0) {
        return {
            productImageUrl: '/sizeGuide.png',
            productImageHandles: {
                left_temple: { x: 25 / 300, y: 60 / 150, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 275 / 300, y: 60 / 150, kind: S.ImageHandleKind.RotateAndScale },
            },
        };
    } else if (i === 1) {
        return {
            productImageUrl: '/productImageB01.png',
            productImageHandles: {
                // left_temple: { x: 295 / 1936, y: 300 / 685, kind: S.ImageHandleKind.RotateAndScale },
                // right_temple: { x: 1667 / 1936, y: 300 / 685, kind: S.ImageHandleKind.RotateAndScale },
                left_temple: { x: 295 / 1936, y: 252 / 685, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 1667 / 1936, y: 248 / 685, kind: S.ImageHandleKind.RotateAndScale },
            },
        };
    } else if (i === 2) {
        return {
            productImageUrl: '/productImageB02.png',
            productImageHandles: {
                left_temple: { x: 58 / 600, y: 220 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 546 / 600, y: 228 / 600, kind: S.ImageHandleKind.RotateAndScale },
            },
        };
    } else if (i === 3) {
        return {
            productImageUrl: '/productImageB03.png',
            productImageHandles: {
                left_temple: { x: 48 / 600, y: 223 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 546 / 600, y: 231 / 600, kind: S.ImageHandleKind.RotateAndScale },
            },
        };
    } else if (i === 4) {
        return {
            productImageUrl: '/productImageB04.png',
            productImageHandles: {
                left_temple: { x: 58 / 600, y: 213 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 546 / 600, y: 221 / 600, kind: S.ImageHandleKind.RotateAndScale },
            },
        };
    } else if (i === 5) {
        return {
            productImageUrl: '/productImageB05.png',
            productImageHandles: {
                left_temple: { x: 50 / 600, y: 220 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 542 / 600, y: 224 / 600, kind: S.ImageHandleKind.RotateAndScale },
            },
        };
    }
}


function getUser(i: number) {
    if (i === 0) {
        return {
            userImageUrl: '/userImage02.jpg',
            userImageHandles: {
                left_temple: { x: 184 / 600, y: 230 / 600 },
                right_temple: { x: 393 / 600, y: 199 / 600 },
            },
        };
    } else if (i === 1) {
        return {
            userImageUrl: '/userModelWoman_600sq.jpg',
            userImageHandles: {
                left_temple: { x: 222 / 600, y: 241 / 600 },
                right_temple: { x: 401 / 600, y: 246 / 600 },
            },
        };
    } else if (i === 2) {
        return {
            userImageUrl: '/userModelMan_600sq.jpg',
            userImageHandles: {
                left_temple: { x: 200 / 600, y: 223 / 600 },
                right_temple: { x: 413 / 600, y: 224 / 600 },
            },
        };
    } else if (i === 3) {
        return {
            userImageUrl: '/userModelChild_600sq.jpg',
            userImageHandles: {
                left_temple: { x: 206 / 600, y: 270 / 600 },
                right_temple: { x: 426 / 600, y: 267 / 600 },
            },
        };
    } else if (i === 4) {
        return {
            userImageUrl: '/userImage03.png',
            userImageHandles: {
                left_temple: { x: 268 / 600, y: 316 / 600 },
                right_temple: { x: 438 / 600, y: 227 / 600 },
            },
        };
    }
}

// function getUser(i: number) {
//     if (i === 0) {
//         return {
//             userImageUrl: '/userImage00.png',
//             userImageHandles: {
//                 left_temple: { x: 168 / 600, y: 260 / 600 },
//                 right_temple: { x: 438 / 600, y: 260 / 600 },
//                 left_earpiece: { x: 145 / 600, y: 278 / 600 },
//                 right_earpiece: { x: 460 / 600, y: 292 / 600 },
//             },
//         };
//     } else if (i === 1) {
//         return {
//             userImageUrl: '/userImage01.png',
//             userImageHandles: {
//                 left_temple: { x: 62 / 220, y: 78 / 215 },
//                 right_temple: { x: 135 / 220, y: 78 / 215 },
//                 left_earpiece: { x: 59 / 220, y: 83 / 215 },
//                 right_earpiece: { x: 138 / 220, y: 78 / 215 },
//             },
//         };
//     } else if (i === 2) {
//         return {
//             userImageUrl: '/userImage02.jpg',
//             userImageHandles: {
//                 left_temple: { x: 184 / 600, y: 230 / 600 },
//                 right_temple: { x: 393 / 600, y: 199 / 600 },
//                 // left_temple: { x: 185 / 600, y: 235 / 600 },
//                 // right_temple: { x: 394 / 600, y: 204 / 600 },
//                 left_earpiece: { x: 150 / 600, y: 255 / 600 },
//                 right_earpiece: { x: 425 / 600, y: 205 / 600 },
//             },
//         };
//     } else {
//         return {
//             userImageUrl: '/userImage03.png',
//             userImageHandles: {
//                 left_temple: { x: 243 / 600, y: 316 / 600 },
//                 right_temple: { x: 452 / 600, y: 207 / 600 },
//                 left_earpiece: { x: 161 / 600, y: 282 / 600 },
//                 right_earpiece: { x: 413 / 600, y: 186 / 600 },
//             },
//         };
//     }
// }

// function getProduct(i: number) {
//     if (i === 1) {
//         return {
//             productImageUrl: '/productImageB01.png',
//             productImageHandles: {
//                 left_temple: { x: 0.1, y: 0.1, kind: S.ImageHandleKind.RotateAndScale },
//                 right_temple: { x: 0.9, y: 0.1, kind: S.ImageHandleKind.RotateAndScale },
//             },
//         };
//         // return {
//         //     productImageUrl: '/sampleCutout.png',
//         //     productImageHandles: {
//         //         // center: { x: 670 / 1348, y: 129 / 462, kind: S.ImageHandleKind.Anchor },
//         //         // left_temple: { x: 35 / 1348, y: 121 / 462, kind: S.ImageHandleKind.RotateAndScale },
//         //         // right_temple: { x: 1296 / 1348, y: 114 / 462, kind: S.ImageHandleKind.RotateAndScale },

//         //         // center: { x: 0.5, y: 0.1, kind: S.ImageHandleKind.Anchor },
//         //         left_temple: { x: 0.1, y: 0.1, kind: S.ImageHandleKind.RotateAndScale },
//         //         right_temple: { x: 0.9, y: 0.1, kind: S.ImageHandleKind.RotateAndScale },
//         //     },
//         // };
//         // return {
//         //     productImageUrl: '/productImage01.png',
//         //     productImageHandles: {
//         //         center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
//         //         left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
//         //         right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
//         //         left_earpiece: { x: 10 / 600, y: 286 / 600 },
//         //         right_earpiece: { x: 595 / 600, y: 294 / 600 },
//         //     },
//         // };
//     } else if (i === 2) {
//         return {
//             productImageUrl: '/productImage02.png',
//             productImageHandles: {
//                 center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
//                 left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 left_earpiece: { x: 10 / 600, y: 286 / 600 },
//                 right_earpiece: { x: 595 / 600, y: 294 / 600 },
//             },
//         };
//     } else if (i === 3) {
//         return {
//             productImageUrl: '/productImage03.png',
//             productImageHandles: {
//                 center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
//                 left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 left_earpiece: { x: 10 / 600, y: 286 / 600 },
//                 right_earpiece: { x: 595 / 600, y: 294 / 600 },
//             },
//         };
//     } else if (i === 4) {
//         return {
//             productImageUrl: '/productImage04.png',
//             productImageHandles: {
//                 center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
//                 left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 left_earpiece: { x: 10 / 600, y: 286 / 600 },
//                 right_earpiece: { x: 595 / 600, y: 294 / 600 },
//             },
//         };
//     } else if (i === 5) {
//         return {
//             productImageUrl: '/productImage05.png',
//             productImageHandles: {
//                 center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
//                 left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 left_earpiece: { x: 10 / 600, y: 286 / 600 },
//                 right_earpiece: { x: 595 / 600, y: 294 / 600 },
//             },
//         };
//     } else {
//         return {
//             productImageUrl: '/productImage.png',
//             productImageHandles: {
//                 center: { x: 300 / 600, y: 254 / 600, kind: S.ImageHandleKind.Anchor },
//                 left_temple: { x: 58 / 600, y: 246 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 right_temple: { x: 544 / 600, y: 248 / 600, kind: S.ImageHandleKind.RotateAndScale },
//                 left_earpiece: { x: 18 / 600, y: 280 / 600 },
//                 right_earpiece: { x: 583 / 600, y: 304 / 600 },
//             },
//         };
//     }
// }

// function getUser(i: number) {
//     if (i === 0) {
//         return {
//             userImageUrl: '/userImage00.png',
//             userImageHandles: {
//                 left_temple: { x: 168 / 600, y: 260 / 600 },
//                 right_temple: { x: 438 / 600, y: 260 / 600 },
//                 left_earpiece: { x: 145 / 600, y: 278 / 600 },
//                 right_earpiece: { x: 460 / 600, y: 292 / 600 },
//             },
//         };
//     } else if (i === 1) {
//         return {
//             userImageUrl: '/userImage01.png',
//             userImageHandles: {
//                 left_temple: { x: 62 / 220, y: 78 / 215 },
//                 right_temple: { x: 135 / 220, y: 78 / 215 },
//                 left_earpiece: { x: 59 / 220, y: 83 / 215 },
//                 right_earpiece: { x: 138 / 220, y: 78 / 215 },
//             },
//         };
//     } else if (i === 2) {
//         return {
//             userImageUrl: '/userImage02.jpg',
//             userImageHandles: {
//                 left_temple: { x: 170 / 600, y: 217 / 600 },
//                 right_temple: { x: 406 / 600, y: 184 / 600 },
//                 left_earpiece: { x: 150 / 600, y: 255 / 600 },
//                 right_earpiece: { x: 425 / 600, y: 205 / 600 },
//             },
//         };
//     } else {
//         return {
//             userImageUrl: '/userImage03.png',
//             userImageHandles: {
//                 left_temple: { x: 243 / 600, y: 316 / 600 },
//                 right_temple: { x: 452 / 600, y: 207 / 600 },
//                 left_earpiece: { x: 161 / 600, y: 282 / 600 },
//                 right_earpiece: { x: 413 / 600, y: 186 / 600 },
//             },
//         };
//     }
// }

test();