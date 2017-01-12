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
	var S = __webpack_require__(1);
	function test() {
	    console.log('test START');
	    var host = document.createElement('div');
	    document.body.appendChild(host);
	    host.style.width = '300px';
	    host.style.height = '300px';
	    S.setupUserFitting({
	        host: host,
	        productImageUrl: '/productImage.png',
	        productImageHandles: {
	            center: { x: 300 / 600, y: 254 / 600, kind: S.ImageHandleKind.Move },
	            left_temple: { x: 58 / 600, y: 246 / 600 },
	            right_temple: { x: 544 / 600, y: 248 / 600 },
	            left_earpiece: { x: 18 / 600, y: 280 / 600 },
	            right_earpiece: { x: 583 / 600, y: 304 / 600 },
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
	            left_temple: { x: 166 / 600, y: 217 / 600 },
	            right_temple: { x: 400 / 600, y: 175 / 600 },
	            left_earpiece: { x: 150 / 600, y: 255 / 600 },
	            right_earpiece: { x: 425 / 600, y: 205 / 600 },
	        },
	    });
	    console.log('test END');
	}
	exports.test = test;
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
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var draw_triangle_1 = __webpack_require__(3);
	var ImageHandleKind;
	(function (ImageHandleKind) {
	    ImageHandleKind[ImageHandleKind["Stretch"] = 0] = "Stretch";
	    ImageHandleKind[ImageHandleKind["Move"] = 1] = "Move";
	})(ImageHandleKind = exports.ImageHandleKind || (exports.ImageHandleKind = {}));
	function setupUserFitting(options) {
	    var cvs = document.createElement('canvas');
	    options.host.appendChild(cvs);
	    // Oversize to be able to see better
	    cvs.width = 1200;
	    cvs.height = 800;
	    var w = 600;
	    var h = 600;
	    var ctx = cvs.getContext('2d');
	    ctx.strokeStyle = '#000000';
	    ctx.lineWidth = 4;
	    ctx.strokeRect(0, 0, w, h);
	    // TODO: Add Image Loader (for iOS)
	    var userImage = new Image();
	    userImage.src = options.userImageUrl;
	    userImage.onload = function () {
	        // ctx.save();
	        // ctx.globalAlpha = 0.15;
	        // ctx.drawImage(userImage, 0, 0);
	        // ctx.restore();
	        // c.width = userImage.width;
	        // c.height = userImage.height;
	        refresh();
	    };
	    var productImage = new Image();
	    productImage.src = options.productImageUrl;
	    productImage.onload = function () {
	        ctx.save();
	        ctx.globalAlpha = 0.15;
	        ctx.drawImage(productImage, 0, 0);
	        ctx.restore();
	        refresh();
	    };
	    var c = { context: ctx, width: w, height: h };
	    var refresh = function () {
	        refreshUserFitting(c, userImage, productImage, options);
	    };
	    setTimeout(refresh);
	    cvs.onmousemove = function () { return refresh(); };
	}
	exports.setupUserFitting = setupUserFitting;
	function refreshUserFitting(c, userImage, productImage, options) {
	    console.log('refresh');
	    drawImage(c, userImage, options.userImageHandles, options.userImageHandles);
	    drawImage(c, productImage, options.productImageHandles, options.userImageHandles);
	}
	function drawImage(c, image, handles, handleTargets) {
	    var ctx = c.context;
	    var w = c.width;
	    var h = c.height;
	    var handlesMerged = [];
	    for (var k in handles) {
	        handlesMerged.push({ from: handles[k], to: handleTargets[k] });
	    }
	    handlesMerged = handlesMerged.sort(function (a, b) { return a.from.x - b.from.x; });
	    // Just do a row of cells for now (only vertical dividers)
	    var handles_stretches = handlesMerged.filter(function (x) { return x.from.kind !== ImageHandleKind.Move; });
	    var gaps = handles_stretches.map(function (s, i) { return ({ prev: s, next: handles_stretches[i + 1], xDistance: (handles_stretches[i + 1] || { from: { x: s.from.x } }).from.x - s.from.x }); });
	    gaps.sort(function (a, b) { return b.xDistance - a.xDistance; });
	    var widest = gaps[0];
	    var targetScale = (widest.next.to.x - widest.prev.to.x) /
	        (widest.next.from.x - widest.prev.from.x);
	    console.log('targetScale', targetScale);
	    // Calculate y_top and y_bottom for each stretch handle
	    var stretches = handles_stretches.map(function (x) {
	        var sourceLeft_yRatioFromTop = x.from.y;
	        var sourceLeft_yRatioFromBottom = 1 - sourceLeft_yRatioFromTop;
	        var targetTop = x.to.y - targetScale * sourceLeft_yRatioFromTop;
	        var targetBottom = x.to.y + targetScale * sourceLeft_yRatioFromBottom;
	        return __assign({}, x, { y_top_target: targetTop, y_bottom_target: targetBottom });
	    });
	    var columnCount = stretches.length - 1;
	    var grid = [];
	    for (var i = 0; i < columnCount; i++) {
	        var sourceTop = 0;
	        var sourceBottom = 1;
	        var left = stretches[i];
	        var right = stretches[i + 1];
	        var sourceLeft = left.from.x;
	        var sourceRight = right.from.x;
	        var targetLeft = left.to.x;
	        var targetRight = right.to.x;
	        // Calculate the y scale
	        var target_top_left = left.y_top_target;
	        var target_bottom_left = left.y_bottom_target;
	        var target_top_right = right.y_top_target;
	        var target_bottom_right = right.y_bottom_target;
	        if (i === 0) {
	            var changeRatio = (sourceRight - 0) / (sourceRight - sourceLeft);
	            var targetPerSourceScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
	            targetLeft = targetRight - targetPerSourceScale * sourceRight;
	            sourceLeft = 0;
	            target_top_left = target_top_right - changeRatio * (target_top_right - target_top_left);
	            target_bottom_left = target_bottom_right - changeRatio * (target_bottom_right - target_bottom_left);
	        }
	        if (i === columnCount - 1) {
	            var changeRatio = (1 - sourceRight) / (sourceRight - sourceLeft);
	            var tScale = (targetRight - targetLeft) / (sourceRight - sourceLeft);
	            targetRight = targetLeft + tScale * (1 - sourceLeft);
	            sourceRight = 1;
	            target_top_right = target_top_left + changeRatio * (target_top_right - target_top_left);
	            target_bottom_right = target_bottom_left + changeRatio * (target_bottom_right - target_bottom_left);
	        }
	        grid.push([{
	                source: { x_left: sourceLeft, x_right: sourceRight, y_top: sourceTop, y_bottom: sourceBottom },
	                target: { x_left: targetLeft, x_right: targetRight, y_top_left: target_top_left, y_bottom_left: target_bottom_left, y_top_right: target_top_right, y_bottom_right: target_bottom_right }
	            }]);
	        var g = grid[grid.length - 1][0];
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
	        draw_triangle_1.drawTriangle(ctx, image, w * g.target.x_left, h * g.target.y_top_left, w * g.target.x_right, h * g.target.y_top_right, w * g.target.x_left, h * g.target.y_bottom_left, image.width * g.source.x_left, image.height * g.source.y_top, image.width * g.source.x_right, image.height * g.source.y_top, image.width * g.source.x_left, image.height * g.source.y_bottom);
	        draw_triangle_1.drawTriangle(ctx, image, w * g.target.x_right, h * g.target.y_top_right, w * g.target.x_right, h * g.target.y_bottom_right, w * g.target.x_left, h * g.target.y_bottom_left, image.width * g.source.x_right, image.height * g.source.y_top, image.width * g.source.x_right, image.height * g.source.y_bottom, image.width * g.source.x_left, image.height * g.source.y_bottom);
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
	function calculateScale(s0, s1, t0, t1) {
	    // if (s0 <= s1 || t0 <= t1) { return 0; }
	    return (t1 - t0) / (s1 - s0);
	}
	function calculateSkewY(sx0, sx1, sy0, sy1, ty0, ty1) {
	    var dsx = sx1 - sx0;
	    var dsy = sy1 - sy0;
	    var dty = ty1 - ty0;
	    return (dty - dsy) / dsx;
	}
	function drawHandles(ctx, w, h, handles, color) {
	    var len = 10;
	    for (var k in handles) {
	        console.log('draw handle');
	        var handle = handles[k];
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
	function drawImageSection(ctx, image, handle, handleTargets) {
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	// Based on: jsgl.js https://github.com/spoulson/Code-snippets/blob/master/Javascript/jsgl/jsgl.js
	function drawTriangle(ctx, image, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2, wireframe) {
	    if (wireframe === void 0) { wireframe = true; }
	    if (wireframe) {
	        ctx.lineWidth = 0.5;
	        ctx.strokeStyle = '#00FF00';
	        ctx.beginPath();
	        ctx.moveTo(x0, y0);
	        ctx.lineTo(x1, y1);
	        ctx.lineTo(x2, y2);
	        ctx.lineTo(x0, y0);
	        ctx.stroke();
	        ctx.closePath();
	        ctx.strokeStyle = '#0000FF';
	        ctx.beginPath();
	        ctx.moveTo(sx0, sy0);
	        ctx.lineTo(sx1, sy1);
	        ctx.lineTo(sx2, sy2);
	        ctx.lineTo(sx0, sy0);
	        ctx.stroke();
	        ctx.closePath();
	    }
	    console.log("Target: (" + x0 + "," + y0 + ")-(" + x1 + "," + y1 + ")-(" + x2 + "," + y2 + ")");
	    console.log("Source: (" + sx0 + "," + sy0 + ")-(" + sx1 + "," + sy1 + ")-(" + sx2 + "," + sy2 + ")");
	    ctx.save();
	    // Clip the output to the on-screen triangle boundaries.
	    ctx.beginPath();
	    ctx.moveTo(x0, y0);
	    ctx.lineTo(x1, y1);
	    ctx.lineTo(x2, y2);
	    ctx.closePath();
	    // ctx.stroke();//xxxxxxx for wireframe
	    ctx.clip();
	    /*
	      ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.
	      The context matrix is:
	      [ m11 m21 dx ]
	      [ m12 m22 dy ]
	      [  0   0   1 ]
	      Coords are column vectors with a 1 in the z coord, so the transform is:
	      x_out = m11 * x + m21 * y + dx;
	      y_out = m12 * x + m22 * y + dy;
	      From Maxima, these are the transform values that map the source
	      coords to the dest coords:
	      sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
	      [m11 = - -----------------------------------------------------,
	      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
	      sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
	      m12 = -----------------------------------------------------,
	      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
	      sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
	      m21 = -----------------------------------------------------,
	      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
	      sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
	      m22 = - -----------------------------------------------------,
	      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
	      sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
	      dx = ----------------------------------------------------------------------,
	      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
	      sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
	      dy = ----------------------------------------------------------------------]
	      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
	    */
	    // TODO: eliminate common subexpressions.
	    var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
	    if (denom === 0) {
	        return;
	    }
	    var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
	    var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
	    var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
	    var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
	    var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
	    var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;
	    ctx.transform(m11, m12, m21, m22, dx, dy);
	    // Draw the whole image.  Transform and clip will map it onto the
	    // correct output triangle.
	    //
	    // TODO: figure out if drawImage goes faster if we specify the rectangle that
	    // bounds the source coords.
	    ctx.drawImage(image, 0, 0);
	    ctx.restore();
	}
	exports.drawTriangle = drawTriangle;
	;


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map