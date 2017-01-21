"use strict";
var DEBUG = false;
var DrawingBuffer = (function () {
    function DrawingBuffer(width, height) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        if (DEBUG) {
            document.body.appendChild(this.canvas);
        }
    }
    DrawingBuffer.prototype.clear = function (width, height) {
        if (this.canvas.width !== width) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this.context.clearRect(0, 0, width, height);
    };
    return DrawingBuffer;
}());
exports.DrawingBuffer = DrawingBuffer;
//# sourceMappingURL=drawing-buffer.js.map