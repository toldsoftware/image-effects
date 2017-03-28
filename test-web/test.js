/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var S = __webpack_require__(1);
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
	    var u4 = getUser(4);
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
	    var productJsonObj = __assign({}, p1.productImageHandles);
	    delete (productJsonObj['center']);
	    console.log('product json', JSON.stringify(productJsonObj));
	    var userJsonObj = __assign({}, u0.userImageHandles);
	    console.log('user json', JSON.stringify(userJsonObj));
	    console.log('test END');
	}
	exports.test = test;
	function addTest(product, user, moveHandleRadius, shouldMoveProductHandles) {
	    if (moveHandleRadius === void 0) { moveHandleRadius = 0.25; }
	    if (shouldMoveProductHandles === void 0) { shouldMoveProductHandles = false; }
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
	        productImageHandles: product.productImageHandles,
	        // shouldMoveProductHandles,
	        moveHandleRadius: moveHandleRadius
	    });
	}
	function getProduct(i) {
	    if (i === 0) {
	        return {
	            productImageUrl: '/sizeGuide.png',
	            productImageHandles: {
	                left_temple: { x: 25 / 300, y: 60 / 150, kind: S.ImageHandleKind.RotateAndScale },
	                right_temple: { x: 275 / 300, y: 60 / 150, kind: S.ImageHandleKind.RotateAndScale },
	            },
	        };
	    }
	    else if (i === 1) {
	        return {
	            productImageUrl: '/productImageB01.png',
	            productImageHandles: {
	                // left_temple: { x: 295 / 1936, y: 300 / 685, kind: S.ImageHandleKind.RotateAndScale },
	                // right_temple: { x: 1667 / 1936, y: 300 / 685, kind: S.ImageHandleKind.RotateAndScale },
	                left_temple: { x: 295 / 1936, y: 252 / 685, kind: S.ImageHandleKind.RotateAndScale },
	                right_temple: { x: 1667 / 1936, y: 248 / 685, kind: S.ImageHandleKind.RotateAndScale },
	            },
	        };
	    }
	    else if (i === 2) {
	        return {
	            productImageUrl: '/productImageB02.png',
	            productImageHandles: {
	                left_temple: { x: 58 / 600, y: 220 / 600, kind: S.ImageHandleKind.RotateAndScale },
	                right_temple: { x: 546 / 600, y: 228 / 600, kind: S.ImageHandleKind.RotateAndScale },
	            },
	        };
	    }
	    else if (i === 3) {
	        return {
	            productImageUrl: '/productImageB03.png',
	            productImageHandles: {
	                left_temple: { x: 48 / 600, y: 223 / 600, kind: S.ImageHandleKind.RotateAndScale },
	                right_temple: { x: 546 / 600, y: 231 / 600, kind: S.ImageHandleKind.RotateAndScale },
	            },
	        };
	    }
	    else if (i === 4) {
	        return {
	            productImageUrl: '/productImageB04.png',
	            productImageHandles: {
	                left_temple: { x: 58 / 600, y: 213 / 600, kind: S.ImageHandleKind.RotateAndScale },
	                right_temple: { x: 546 / 600, y: 221 / 600, kind: S.ImageHandleKind.RotateAndScale },
	            },
	        };
	    }
	    else if (i === 5) {
	        return {
	            productImageUrl: '/productImageB05.png',
	            productImageHandles: {
	                left_temple: { x: 50 / 600, y: 220 / 600, kind: S.ImageHandleKind.RotateAndScale },
	                right_temple: { x: 542 / 600, y: 224 / 600, kind: S.ImageHandleKind.RotateAndScale },
	            },
	        };
	    }
	}
	function getUser(i) {
	    if (i === 0) {
	        return {
	            userImageUrl: '/userImage02.jpg',
	            userImageHandles: {
	                left_temple: { x: 184 / 600, y: 230 / 600 },
	                right_temple: { x: 393 / 600, y: 199 / 600 },
	            },
	        };
	    }
	    else if (i === 1) {
	        return {
	            userImageUrl: '/userModelWoman_600sq.jpg',
	            userImageHandles: {
	                left_temple: { x: 222 / 600, y: 241 / 600 },
	                right_temple: { x: 401 / 600, y: 246 / 600 },
	            },
	        };
	    }
	    else if (i === 2) {
	        return {
	            userImageUrl: '/userModelMan_600sq.jpg',
	            userImageHandles: {
	                left_temple: { x: 200 / 600, y: 223 / 600 },
	                right_temple: { x: 413 / 600, y: 224 / 600 },
	            },
	        };
	    }
	    else if (i === 3) {
	        return {
	            userImageUrl: '/userModelChild_600sq.jpg',
	            userImageHandles: {
	                left_temple: { x: 206 / 600, y: 270 / 600 },
	                right_temple: { x: 426 / 600, y: 267 / 600 },
	            },
	        };
	    }
	    else if (i === 4) {
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(2));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var drawing_buffer_1 = __webpack_require__(3);
	var draw_images_aligned_1 = __webpack_require__(4);
	var DEBUG = false;
	var ImageHandleKind;
	(function (ImageHandleKind) {
	    ImageHandleKind[ImageHandleKind["Stretch"] = 0] = "Stretch";
	    ImageHandleKind[ImageHandleKind["RotateAndScale"] = 1] = "RotateAndScale";
	    ImageHandleKind[ImageHandleKind["Anchor"] = 2] = "Anchor";
	})(ImageHandleKind = exports.ImageHandleKind || (exports.ImageHandleKind = {}));
	function setupUserFitting(options) {
	    var c = new drawing_buffer_1.DrawingBuffer(options.host.clientWidth || 600, options.host.clientHeight || 600);
	    options.host.appendChild(c.canvas);
	    c.canvas.style.width = '100%';
	    // Load Images
	    var userImage = new Image();
	    userImage.onload = function () {
	        refresh();
	    };
	    userImage.src = options.userImageUrl;
	    var productImage = new Image();
	    productImage.onload = function () {
	        refresh();
	    };
	    productImage.src = options.productImageUrl;
	    // Input Vars
	    var shouldDrawHandles = false;
	    var lastActualScale = 1;
	    // Draw
	    var refresh = function () {
	        if (!userImage.width || !productImage.width) {
	            setTimeout(refresh, 250);
	            return;
	        }
	        c.context.clearRect(0, 0, options.host.clientWidth, options.host.clientHeight);
	        var actual = draw_images_aligned_1.drawImagesAligned(c, [toSimpleImageInfo(userImage, options.userImageHandles), toSimpleImageInfo(productImage, options.productImageHandles)], shouldDrawHandles);
	        lastActualScale = actual.actualScale;
	        return actual.actualPosition;
	    };
	    refresh();
	    // Handle User Input
	    if (options.isReadonly) {
	        return;
	    }
	    handleUserInput(c, function (drawHandles, positionChange) {
	        shouldDrawHandles = drawHandles;
	        console.log('positionChange', positionChange, lastActualScale, userImage.width, c.width, userImage.height, c.height);
	        if (!positionChange) {
	            options.userImageHandles.left_temple.x_start = options.userImageHandles.left_temple.x;
	            options.userImageHandles.left_temple.y_start = options.userImageHandles.left_temple.y;
	            options.userImageHandles.right_temple.x_start = options.userImageHandles.right_temple.x;
	            options.userImageHandles.right_temple.y_start = options.userImageHandles.right_temple.y;
	        }
	        else {
	            options.userImageHandles.left_temple.x = options.userImageHandles.left_temple.x_start + positionChange.a.u; // * (userImage.width / c.width);
	            options.userImageHandles.left_temple.y = options.userImageHandles.left_temple.y_start + positionChange.a.v * (userImage.width / userImage.height); // * (userImage.height / c.height);
	            options.userImageHandles.right_temple.x = options.userImageHandles.right_temple.x_start + positionChange.b.u; // * (userImage.width / c.width);
	            options.userImageHandles.right_temple.y = options.userImageHandles.right_temple.y_start + positionChange.b.v * (userImage.width / userImage.height); // * (userImage.height / c.height);
	        }
	        var result = refresh();
	        if (DEBUG && positionChange) {
	            draw_images_aligned_1.drawPoint(c, { u: 0.5 + positionChange.a.u, v: 0.5 + positionChange.a.v }, '#0000FF');
	            draw_images_aligned_1.drawPoint(c, { u: 0.5 + positionChange.b.u, v: 0.5 + positionChange.b.v }, '#0000FF');
	        }
	        return result;
	    });
	}
	exports.setupUserFitting = setupUserFitting;
	function toSimpleImageInfo(image, imageHandles) {
	    var aHandle = imageHandles.left_temple;
	    var bHandle = imageHandles.right_temple;
	    return {
	        image: image,
	        a: { u: aHandle.x, v: aHandle.y },
	        b: { u: bHandle.x, v: bHandle.y },
	    };
	}
	function handleUserInput(c, onChange) {
	    var MOVEMENT_RATIO = 0.5;
	    var MAX_DRAG_RATIO = 0.25;
	    var TIME_REMOVE_HANDLES = 3000;
	    var lastActualPosition = null;
	    var isDraggingWhole = false;
	    var isDraggingPoint = false;
	    var start = null;
	    var startPosition = null;
	    var shouldDrawHandles = false;
	    var removeHandlesTimeoutId = null;
	    var dragStart = function (e) {
	        console.log('dragStart');
	        if (!lastActualPosition) {
	            lastActualPosition = onChange(shouldDrawHandles, null);
	        }
	        if (!lastActualPosition) {
	            return;
	        }
	        startPosition = lastActualPosition;
	        start = getPointInfo(e, c, [startPosition.a, startPosition.b]);
	        shouldDrawHandles = true;
	        // console.log('dragStart', e, lastActual, start);
	        var nearest = start.nearest;
	        if (!nearest) {
	            return;
	        }
	        subscribe();
	        var distance = draw_images_aligned_1.getDistance(lastActualPosition);
	        var maxMoveWholeDistanceSq = distance * distance;
	        var maxMovePointDistanceSq = maxMoveWholeDistanceSq * MAX_DRAG_RATIO * MAX_DRAG_RATIO;
	        if (nearest.distanceSq < maxMovePointDistanceSq) {
	            isDraggingPoint = true;
	        }
	        else if (nearest.distanceSq < maxMoveWholeDistanceSq) {
	            isDraggingWhole = true;
	        }
	        if (DEBUG) {
	            setTimeout(function () {
	                console.log('dragStart distance', distance);
	                draw_images_aligned_1.drawPoint(c, start, '#FF0000', c.width * Math.sqrt(nearest.distanceSq));
	                draw_images_aligned_1.drawPoint(c, start, '#FFFF00', c.width * Math.sqrt(maxMovePointDistanceSq));
	                draw_images_aligned_1.drawPoint(c, start, '#FF00FF', c.width * Math.sqrt(maxMoveWholeDistanceSq));
	            }, 10);
	            console.log('dragStart', isDraggingPoint, isDraggingWhole, nearest.distanceSq, maxMovePointDistanceSq, maxMoveWholeDistanceSq, e, lastActualPosition, start);
	        }
	        onChange(shouldDrawHandles, null);
	    };
	    var dragEnd = function () {
	        console.log('dragEnd');
	        unsubscribe();
	        isDraggingPoint = isDraggingWhole = false;
	    };
	    var dragMove = function (e) {
	        console.log('dragMove');
	        if (!isDraggingPoint && !isDraggingWhole) {
	            return;
	        }
	        shouldDrawHandles = true;
	        // Move the nearest point
	        var _a = getPointInfo(e, c, [lastActualPosition.a, lastActualPosition.b]), u = _a.u, v = _a.v, u2 = _a.u2, v2 = _a.v2, nearest = _a.nearest;
	        var startPoint = start.nearest.index === 0 ? startPosition.a : startPosition.b;
	        var newPoint = { u: 0, v: 0 };
	        newPoint.u = (u - start.u) * MOVEMENT_RATIO;
	        newPoint.v = (v - start.v) * MOVEMENT_RATIO;
	        var newPoint2 = { u: 0, v: 0 };
	        newPoint2.u = (u2 - start.u2) * MOVEMENT_RATIO;
	        newPoint2.v = (v2 - start.v2) * MOVEMENT_RATIO;
	        var positionChange = { a: { u: 0, v: 0 }, b: { u: 0, v: 0 } };
	        if (isDraggingPoint) {
	            if (start.nearest.index === 0) {
	                positionChange.a = newPoint;
	                positionChange.b = newPoint2;
	            }
	            else {
	                positionChange.b = newPoint;
	                positionChange.a = newPoint2;
	            }
	        }
	        else if (isDraggingWhole) {
	            positionChange.a = newPoint;
	            positionChange.b = newPoint;
	        }
	        lastActualPosition = onChange(shouldDrawHandles, positionChange);
	        var removeHandles = function () {
	            clearTimeout(removeHandlesTimeoutId);
	            removeHandlesTimeoutId = setTimeout(function () {
	                if (isDraggingPoint) {
	                    removeHandles();
	                    return;
	                }
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
	    var subscribe = function () {
	        // console.log('subscribe');
	        document.addEventListener('mouseup', dragEnd);
	        document.addEventListener('mousemove', dragMove);
	    };
	    var unsubscribe = function () {
	        // console.log('unsubscribe');
	        document.removeEventListener('mouseup', dragEnd);
	        document.removeEventListener('mousemove', dragMove);
	    };
	}
	function getPointInfo(e, c, points) {
	    var cvs = c.canvas;
	    var w = c.width;
	    var h = c.height;
	    var rect = cvs.getBoundingClientRect();
	    var xm = 0;
	    var ym = 0;
	    var xm2 = null;
	    var ym2 = null;
	    var eMouse = e;
	    var eTouch = e;
	    if (eMouse.clientX != null) {
	        xm = eMouse.clientX - rect.left;
	        ym = eMouse.clientY - rect.top;
	    }
	    else if (eTouch.touches != null) {
	        xm = eTouch.touches[0].clientX - rect.left;
	        ym = eTouch.touches[0].clientY - rect.top;
	        if (eTouch.touches[1]) {
	            xm2 = eTouch.touches[1].clientX - rect.left;
	            ym2 = eTouch.touches[1].clientY - rect.top;
	        }
	    }
	    var u = xm / w;
	    var v = ym / h;
	    var u2 = xm2 ? xm2 / w : null;
	    var v2 = ym2 ? ym2 / h : null;
	    var nearest = !points || !points.length ? null
	        : points.map(function (p, i) { return ({ point: p, index: i, distanceSq: (p.u - u) * (p.u - u) + (p.v - v) * (p.v - v) }); }).sort(function (a, b) { return a.distanceSq - b.distanceSq; })[0];
	    // DEBUG
	    if (DEBUG) {
	        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
	            var p = points_1[_i];
	            draw_images_aligned_1.drawPoint(c, p, '#FFFF00', 4);
	        }
	        draw_images_aligned_1.drawPoint(c, { u: u, v: v }, '#FF00FF', 4);
	        if (u2) {
	            draw_images_aligned_1.drawPoint(c, { u: u2, v: v2 }, '#FF00FF', 4);
	        }
	        draw_images_aligned_1.drawPoint(c, nearest.point, '#FF0000', 4);
	    }
	    return { u: u, v: v, u2: u2, v2: v2, nearest: nearest };
	}
	;
	var tempPointInfo = null && getPointInfo(null, null, null);


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var DEBUG = false;
	var DrawingBuffer = (function () {
	    function DrawingBuffer(width, height) {
	        this.canvas = document.createElement('canvas');
	        this.width = this.canvas.width = width;
	        this.height = this.canvas.height = height;
	        this.context = this.canvas.getContext('2d');
	        if (DEBUG) {
	            document.body.appendChild(this.canvas);
	        }
	    }
	    DrawingBuffer.prototype.clear = function (width, height) {
	        if (this.canvas.width !== width) {
	            this.width = this.canvas.width = width;
	            this.height = this.canvas.height = height;
	        }
	        this.context.clearRect(0, 0, width, height);
	    };
	    return DrawingBuffer;
	}());
	exports.DrawingBuffer = DrawingBuffer;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var drawing_buffer_1 = __webpack_require__(3);
	var draw_with_blur_1 = __webpack_require__(5);
	var buffer = new drawing_buffer_1.DrawingBuffer(1200, 1200);
	function drawImagesAligned(cOrig, images, shouldDrawPosition) {
	    // Anti-alias by drawing at a higher scale and resizing after merging
	    // const scale = 600 / cOrig.width;
	    var drawScale = 2;
	    var wBuffer = drawScale * cOrig.width;
	    var hBuffer = drawScale * cOrig.height;
	    buffer.clear(wBuffer, hBuffer);
	    var c = buffer;
	    // Draw the main image and get it's actual position
	    var mainImage = images[0];
	    var _a = drawImageCentered(c, mainImage), mainPosition = _a.mainPosition, mainScale = _a.mainScale;
	    // Draw each image
	    for (var i = 0; i < images.length; i++) {
	        if (i === 0) {
	            continue;
	        }
	        drawImageAligned(c, images[i], mainPosition);
	    }
	    if (shouldDrawPosition) {
	        drawPosition(c, mainPosition);
	    }
	    // Resize
	    cOrig.context.drawImage(buffer.canvas, 0, 0, wBuffer, hBuffer, 0, 0, cOrig.width, cOrig.height);
	    // const actualPosition = {
	    //     a: {
	    //         u: mainPosition.a.u / scale,
	    //         v: mainPosition.a.v / scale,
	    //     },
	    //     b: {
	    //         u: mainPosition.b.u / scale,
	    //         v: mainPosition.b.v / scale,
	    //     }
	    // };
	    var actualPosition = mainPosition;
	    return { actualPosition: actualPosition, actualScale: mainScale * drawScale };
	}
	exports.drawImagesAligned = drawImagesAligned;
	function drawImageCentered(c, image) {
	    var w = c.width;
	    var h = c.height;
	    var wImage = image.image.width;
	    var hImage = image.image.height;
	    var wScale = w / wImage;
	    var hScale = h / hImage;
	    // Fill
	    // const scale = Math.max(wScale, hScale);
	    // Fit Inside
	    var mainScale = Math.min(wScale, hScale);
	    // const scale = 1;
	    var x = 0.5 * (w - mainScale * wImage);
	    var y = 0.5 * (h - mainScale * hImage);
	    c.context.drawImage(image.image, 0, 0, wImage, hImage, x, y, mainScale * wImage, mainScale * hImage);
	    var mainPosition = {
	        a: {
	            u: (x + image.a.u * wImage * mainScale) / w,
	            v: (y + image.a.v * hImage * mainScale) / h,
	        },
	        b: {
	            u: (x + image.b.u * wImage * mainScale) / w,
	            v: (y + image.b.v * hImage * mainScale) / h,
	        },
	    };
	    return { mainPosition: mainPosition, mainScale: mainScale };
	}
	function drawPosition(c, position) {
	    drawPoint(c, position.a);
	    drawPoint(c, position.b);
	}
	exports.drawPosition = drawPosition;
	function drawPoint(c, point, color, radius) {
	    if (color === void 0) { color = '#00FF00'; }
	    if (radius === void 0) { radius = 16; }
	    var ctx = c.context;
	    var w = c.width;
	    var h = c.height;
	    var thickness = 2;
	    var u = point.u;
	    var v = point.v;
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
	exports.drawPoint = drawPoint;
	function drawImageAligned(c, image, position) {
	    var uAxis = (position.a.u + position.b.u) * 0.5;
	    var vAxis = (position.a.v + position.b.v) * 0.5;
	    var uAxis_image = (image.a.u + image.b.u) * 0.5;
	    var vAxis_image = (image.a.v + image.b.v) * 0.5;
	    var ctx = c.context;
	    var w = c.width;
	    var h = c.height;
	    var wImage = image.image.width;
	    var hImage = image.image.height;
	    var posDistance = getDistance(position);
	    var imageDistance = getDistance(image);
	    var uvScale = posDistance / imageDistance;
	    var scale = uvScale * w / wImage;
	    // console.log('distance', posDistance, imageDistance, scale, w, h, wImage, hImage);
	    var posAngle = getAngle(position);
	    var imageAngle = getAngle(image);
	    var angle = posAngle - imageAngle;
	    var xAxis = w * uAxis;
	    var yAxis = h * vAxis;
	    var xImage = xAxis - uAxis_image * scale * wImage;
	    var yImage = yAxis - vAxis_image * scale * hImage;
	    ctx.save();
	    ctx.translate(uAxis * w, vAxis * h);
	    ctx.rotate(angle);
	    ctx.translate(-uAxis * w, -vAxis * h);
	    // ctx.drawImage(image.image,
	    //     0, 0, wImage, hImage,
	    //     xImage, yImage, scale * wImage, scale * hImage
	    // );
	    draw_with_blur_1.drawWithEdgeBlur(ctx, w, h, function (ctx2) {
	        ctx2.drawImage(image.image, 0, 0, wImage, hImage, xImage, yImage, scale * wImage, scale * hImage);
	    });
	    ctx.restore();
	}
	function getDistance(position) {
	    var uDelta = position.a.u - position.b.u;
	    var vDelta = position.a.v - position.b.v;
	    return Math.sqrt(uDelta * uDelta + vDelta * vDelta);
	}
	exports.getDistance = getDistance;
	function getAngle(position) {
	    var uDelta = position.a.u - position.b.u;
	    var vDelta = position.a.v - position.b.v;
	    return Math.atan(vDelta / uDelta);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var drawing_buffer_1 = __webpack_require__(3);
	var drawBuffer;
	var blurBuffer;
	var mergeBuffer;
	// Draw edge blur by downsampling image to half size, drawing that first and then drawing sharp image on top
	function drawWithEdgeBlur(ctx, width, height, draw) {
	    var downsample_ratio = 0.5;
	    var downsample_alpha = 0.5;
	    if (drawBuffer == null) {
	        drawBuffer = new drawing_buffer_1.DrawingBuffer(width, height);
	    }
	    drawBuffer.clear(width, height);
	    if (blurBuffer == null) {
	        blurBuffer = new drawing_buffer_1.DrawingBuffer(width * downsample_ratio, height * downsample_ratio);
	    }
	    blurBuffer.clear(width * downsample_ratio, height * downsample_ratio);
	    if (mergeBuffer == null) {
	        mergeBuffer = new drawing_buffer_1.DrawingBuffer(width, height);
	    }
	    mergeBuffer.clear(width, height);
	    draw(drawBuffer.context);
	    blurBuffer.context.drawImage(drawBuffer.canvas, 0, 0, width, height, 0, 0, width * downsample_ratio, height * downsample_ratio);
	    mergeBuffer.context.globalAlpha = downsample_alpha;
	    mergeBuffer.context.drawImage(blurBuffer.canvas, 0, 0, width * downsample_ratio, height * downsample_ratio, 0, 0, width, height);
	    mergeBuffer.context.globalAlpha = 1;
	    mergeBuffer.context.drawImage(drawBuffer.canvas, 0, 0, width, height, 0, 0, width, height);
	    ctx.drawImage(mergeBuffer.canvas, 0, 0, width, height, 0, 0, width, height);
	}
	exports.drawWithEdgeBlur = drawWithEdgeBlur;


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map