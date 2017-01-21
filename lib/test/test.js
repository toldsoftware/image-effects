"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var S = require("../src");
function test() {
    console.log('test START');
    var p0 = getProduct(0);
    var p1 = getProduct(1);
    var p2 = getProduct(2);
    var p3 = getProduct(3);
    var p4 = getProduct(4);
    var p5 = getProduct(5);
    var u0 = getUser(0);
    var u1 = getUser(1);
    var u2 = getUser(2);
    var u3 = getUser(3);
    addTest(p0, u0);
    addTest(p0, u1);
    addTest(p0, u2);
    addTest(p0, u3);
    addTest(p1, u0);
    addTest(p1, u1);
    addTest(p1, u2);
    addTest(p1, u3);
    addTest(p2, u0);
    addTest(p2, u1);
    addTest(p2, u2);
    addTest(p2, u3);
    addTest(p3, u0);
    addTest(p3, u1);
    addTest(p3, u2);
    addTest(p3, u3);
    addTest(p4, u0);
    addTest(p4, u1);
    addTest(p4, u2);
    addTest(p4, u3);
    addTest(p5, u0);
    addTest(p5, u1);
    addTest(p5, u2);
    addTest(p5, u3);
    var productJsonObj = __assign({}, p1.productImageHandles);
    delete (productJsonObj.center);
    console.log('product json', JSON.stringify(productJsonObj));
    var userJsonObj = __assign({}, u0.userImageHandles);
    console.log('user json', JSON.stringify(userJsonObj));
    console.log('test END');
}
exports.test = test;
function addTest(product, user) {
    var host = document.createElement('div');
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
function getProduct(i) {
    if (i === 1) {
        return {
            productImageUrl: '/productImage01.png',
            productImageHandles: {
                center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
                left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
                left_earpiece: { x: 10 / 600, y: 286 / 600 },
                right_earpiece: { x: 595 / 600, y: 294 / 600 },
            },
        };
    }
    else if (i === 2) {
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
    else if (i === 3) {
        return {
            productImageUrl: '/productImage03.png',
            productImageHandles: {
                center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
                left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
                left_earpiece: { x: 10 / 600, y: 286 / 600 },
                right_earpiece: { x: 595 / 600, y: 294 / 600 },
            },
        };
    }
    else if (i === 4) {
        return {
            productImageUrl: '/productImage04.png',
            productImageHandles: {
                center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
                left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
                left_earpiece: { x: 10 / 600, y: 286 / 600 },
                right_earpiece: { x: 595 / 600, y: 294 / 600 },
            },
        };
    }
    else if (i === 5) {
        return {
            productImageUrl: '/productImage05.png',
            productImageHandles: {
                center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Anchor },
                left_temple: { x: 58 / 600, y: 243 / 600, kind: S.ImageHandleKind.RotateAndScale },
                right_temple: { x: 546 / 600, y: 251 / 600, kind: S.ImageHandleKind.RotateAndScale },
                left_earpiece: { x: 10 / 600, y: 286 / 600 },
                right_earpiece: { x: 595 / 600, y: 294 / 600 },
            },
        };
    }
    else {
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
    }
}
function getUser(i) {
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
    }
    else if (i === 1) {
        return {
            userImageUrl: '/userImage01.png',
            userImageHandles: {
                left_temple: { x: 62 / 220, y: 78 / 215 },
                right_temple: { x: 135 / 220, y: 78 / 215 },
                left_earpiece: { x: 59 / 220, y: 83 / 215 },
                right_earpiece: { x: 138 / 220, y: 78 / 215 },
            },
        };
    }
    else if (i === 2) {
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
    else {
        return {
            userImageUrl: '/userImage03.png',
            userImageHandles: {
                left_temple: { x: 243 / 600, y: 316 / 600 },
                right_temple: { x: 452 / 600, y: 207 / 600 },
                left_earpiece: { x: 161 / 600, y: 282 / 600 },
                right_earpiece: { x: 413 / 600, y: 186 / 600 },
            },
        };
    }
}
test();
//# sourceMappingURL=test.js.map