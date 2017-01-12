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
	    addTest(0, 0);
	    addTest(0, 1);
	    addTest(0, 2);
	    addTest(1, 0);
	    addTest(1, 1);
	    addTest(1, 2);
	    console.log('test END');
	}
	exports.test = test;
	function addTest(p, u) {
	    var host = document.createElement('div');
	    document.body.appendChild(host);
	    host.style.width = '300px';
	    host.style.height = '300px';
	    host.style.display = 'inline-block';
	    var product = getProduct(p);
	    var user = getUser(u);
	    S.setupUserFitting({
	        host: host,
	        userImageUrl: user.userImageUrl,
	        userImageHandles: user.userImageHandles,
	        productImageUrl: product.productImageUrl,
	        productImageHandles: product.productImageHandles
	    });
	}
	function getProduct(i) {
	    if (i === 0) {
	        return {
	            productImageUrl: '/productImage.png',
	            productImageHandles: {
	                center: { x: 300 / 600, y: 254 / 600, kind: S.ImageHandleKind.Move },
	                left_temple: { x: 58 / 600, y: 246 / 600 },
	                right_temple: { x: 544 / 600, y: 248 / 600 },
	                left_earpiece: { x: 18 / 600, y: 280 / 600 },
	                right_earpiece: { x: 583 / 600, y: 304 / 600 },
	            },
	        };
	    }
	    else {
	        return {
	            productImageUrl: '/productImage02.png',
	            productImageHandles: {
	                center: { x: 296 / 600, y: 267 / 600, kind: S.ImageHandleKind.Move },
	                left_temple: { x: 58 / 600, y: 243 / 600 },
	                right_temple: { x: 546 / 600, y: 251 / 600 },
	                left_earpiece: { x: 10 / 600, y: 286 / 600 },
	                right_earpiece: { x: 595 / 600, y: 294 / 600 },
	            },
	        };
	    }
	}
	function getUser(i) {
	    if (i === 0) {
	        return {
	            userImageUrl: '/userImage00.png',
	            userImageHandles: {
	                center: { x: 302 / 600, y: 264 / 600, kind: S.ImageHandleKind.Move },
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
	                center: { x: 97 / 220, y: 78 / 215, kind: S.ImageHandleKind.Move },
	                left_temple: { x: 62 / 220, y: 78 / 215 },
	                right_temple: { x: 135 / 220, y: 78 / 215 },
	                left_earpiece: { x: 59 / 220, y: 83 / 215 },
	                right_earpiece: { x: 138 / 220, y: 78 / 215 },
	            },
	        };
	    }
	    else {
	        return {
	            userImageUrl: '/userImage02.jpg',
	            userImageHandles: {
	                center: { x: 286 / 600, y: 202 / 600, kind: S.ImageHandleKind.Move },
	                left_temple: { x: 170 / 600, y: 217 / 600 },
	                right_temple: { x: 406 / 600, y: 184 / 600 },
	                left_earpiece: { x: 150 / 600, y: 255 / 600 },
	                right_earpiece: { x: 425 / 600, y: 205 / 600 },
	            },
	        };
	    }
	}
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
	var draw_triangle_1 = __webpack_require__(3);
	var DEBUG = false;
	var ImageHandleKind;
	(function (ImageHandleKind) {
	    ImageHandleKind[ImageHandleKind["Stretch"] = 0] = "Stretch";
	    ImageHandleKind[ImageHandleKind["Move"] = 1] = "Move";
	})(ImageHandleKind = exports.ImageHandleKind || (exports.ImageHandleKind = {}));
	function setupUserFitting(options) {
	    var cvs = document.createElement('canvas');
	    options.host.appendChild(cvs);
	    cvs.width = options.host.clientWidth;
	    cvs.height = options.host.clientHeight;
	    var w = cvs.width;
	    var h = cvs.height;
	    // Oversize to be able to see better
	    if (DEBUG) {
	        cvs.width = 1200;
	        cvs.height = 800;
	        w = 600;
	        h = 600;
	    }
	    var ctx = cvs.getContext('2d');
	    if (DEBUG) {
	        ctx.strokeStyle = '#000000';
	        ctx.lineWidth = 4;
	        ctx.strokeRect(0, 0, w, h);
	    }
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
	        if (DEBUG) {
	            ctx.save();
	            ctx.globalAlpha = 0.15;
	            ctx.drawImage(productImage, 0, 0);
	            ctx.restore();
	        }
	        refresh();
	    };
	    var c = { context: ctx, width: w, height: h };
	    var refresh = function () {
	        if (!DEBUG) {
	            c.width = w = cvs.width;
	            c.height = h = cvs.height;
	        }
	        refreshUserFitting(c, userImage, productImage, options);
	    };
	    setTimeout(refresh);
	    cvs.onmousemove = function () { return refresh(); };
	}
	exports.setupUserFitting = setupUserFitting;
	function log(message) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    if (DEBUG) {
	        console.log.apply(console, [message].concat(args));
	    }
	}
	function refreshUserFitting(c, userImage, productImage, options) {
	    log('refresh');
	    drawImage(c, userImage, options.userImageHandles, options.userImageHandles);
	    drawImage(c, productImage, options.productImageHandles, options.userImageHandles);
	}
	function drawImage(c, image, handles, handleTargets) {
	    var ctx = c.context;
	    var w = c.width;
	    var h = c.height;
	    var handlesMerged = [];
	    for (var k in handles) {
	        handlesMerged.push({ source: handles[k], target: handleTargets[k] });
	    }
	    handlesMerged = handlesMerged.sort(function (a, b) { return a.source.x - b.source.x; });
	    // Just do a row of cells for now (only vertical dividers)
	    var handles_stretches = handlesMerged.filter(function (x) { return x.source.kind !== ImageHandleKind.Move; });
	    var gaps = handles_stretches.map(function (s, i) { return ({ prev: s, next: handles_stretches[i + 1], xDistance: (handles_stretches[i + 1] || { source: { x: s.source.x } }).source.x - s.source.x }); });
	    gaps.sort(function (a, b) { return b.xDistance - a.xDistance; });
	    // log('gaps', gaps);
	    var widest = gaps[0];
	    var targetScale = (widest.next.target.x - widest.prev.target.x) /
	        (widest.next.source.x - widest.prev.source.x);
	    var y_delta_source = widest.next.source.y - widest.prev.source.y;
	    var x_delta_source = widest.next.source.x - widest.prev.source.x;
	    var y_delta_target = widest.next.target.y - widest.prev.target.y;
	    var x_delta_target = widest.next.target.x - widest.prev.target.x;
	    var sourceAngle = Math.atan(y_delta_source / x_delta_source);
	    var targetAngle = Math.atan(y_delta_target / x_delta_target);
	    var mainAngle = targetAngle - sourceAngle;
	    // TEMP: Testing
	    // mainAngle = 0;
	    log('targetScale', targetScale, 'y_delta_source', y_delta_source, 'x_delta_source', x_delta_source, 'y_delta_target', y_delta_target, 'x_delta_target', x_delta_target, 'sourceAngle', sourceAngle * 180 / Math.PI, 'targetAngle', targetAngle * 180 / Math.PI, 'mainAngle', mainAngle * 180 / Math.PI);
	    ctx.save();
	    ctx.rotate(mainAngle);
	    // Calculate y_top and y_bottom for each stretch handle
	    var stretches = handles_stretches.map(function (s) {
	        var sourceLeft_yRatioFromTop = s.source.y;
	        var sourceLeft_yRatioFromBottom = 1 - sourceLeft_yRatioFromTop;
	        var targetTop = s.target.y - targetScale * sourceLeft_yRatioFromTop;
	        var targetBottom = s.target.y + targetScale * sourceLeft_yRatioFromBottom;
	        return {
	            source: s.source,
	            target_orig: s.target,
	            target: rotate(s.target, -mainAngle),
	            y_top_target: rotateY(s.target.x, targetTop, -mainAngle),
	            y_bottom_target: rotateY(s.target.x, targetBottom, -mainAngle),
	        };
	    });
	    var columnCount = stretches.length - 1;
	    var grid = [];
	    for (var i = 0; i < columnCount; i++) {
	        var sourceTop = 0;
	        var sourceBottom = 1;
	        var left = stretches[i];
	        var right = stretches[i + 1];
	        var sourceLeft = left.source.x;
	        var sourceRight = right.source.x;
	        var targetLeft = left.target.x;
	        var targetRight = right.target.x;
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
	            var changeRatio = (1 - sourceLeft) / (sourceRight - sourceLeft);
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
	        draw_triangle_1.drawTriangle(ctx, image, w * g.target.x_left, h * g.target.y_top_left, w * g.target.x_right, h * g.target.y_top_right, w * g.target.x_left, h * g.target.y_bottom_left, image.width * g.source.x_left, image.height * g.source.y_top, image.width * g.source.x_right, image.height * g.source.y_top, image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG);
	        draw_triangle_1.drawTriangle(ctx, image, w * g.target.x_right, h * g.target.y_top_right, w * g.target.x_right, h * g.target.y_bottom_right, w * g.target.x_left, h * g.target.y_bottom_left, image.width * g.source.x_right, image.height * g.source.y_top, image.width * g.source.x_right, image.height * g.source.y_bottom, image.width * g.source.x_left, image.height * g.source.y_bottom, DEBUG);
	    }
	    if (DEBUG) {
	        stretches.forEach(function (s) {
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
	        drawHandles(ctx, w, h, stretches.map(function (s) { return s.target; }), '#FF00FF');
	        drawHandles(ctx, w, h, handles, '#FF0000');
	        drawHandles(ctx, w, h, handleTargets, '#00FF00');
	    }
	    ctx.restore();
	}
	function rotate(handle, angle) {
	    var x_rotate = handle.x * Math.cos(angle) - handle.y * Math.sin(angle);
	    var y_rotate = handle.x * Math.sin(angle) + handle.y * Math.cos(angle);
	    return {
	        kind: handle.kind,
	        x: x_rotate,
	        y: y_rotate,
	    };
	}
	function rotateY(x, y, angle) {
	    var y_rotate = x * Math.sin(angle) + y * Math.cos(angle);
	    return y_rotate;
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
	        log('draw handle');
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
	    if (wireframe === void 0) { wireframe = false; }
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
	    // console.log(`Target: (${x0},${y0})-(${x1},${y1})-(${x2},${y2})`);
	    // console.log(`Source: (${sx0},${sy0})-(${sx1},${sy1})-(${sx2},${sy2})`);
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