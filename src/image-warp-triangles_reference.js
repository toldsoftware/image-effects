// From http://jsfiddle.net/mrbendel/6rbtde5t/
var controls = [];
var canvas;
var context;
var context3D;
var image;

var rand = function (s, e) {
    return Math.random() * (e - s) + s;
}

// dom ready
$(document).ready(function () {
    image = new Image();
    $(image).load(function () {
        // draw();
        setInterval(draw, 1000 / 60);
    });
    $(image).attr('src', 'http://media.giphy.com/media/NWb6sWXQQTqwg/giphy.gif');

    canvas = document.createElement('canvas');
    $(canvas).attr('width', 500);
    $(canvas).attr('height', 500);
    $('body').append(canvas);

    context = canvas.getContext('2d');
    context3D = new jsgl.Context(context);

    //
    for (var i = 0; i < 4; ++i) {
        var control = document.createElement('div');
        $(control).addClass('node');
        $('body').append(control);
        controls.push(control);
    }

    $(controls[0]).css('left', rand(25, 225));
    $(controls[0]).css('top', rand(25, 225));

    $(controls[1]).css('left', rand(250, 475));
    $(controls[1]).css('top', rand(25, 225));

    $(controls[2]).css('left', rand(250, 475));
    $(controls[2]).css('top', rand(250, 475));

    $(controls[3]).css('left', rand(25, 225));
    $(controls[3]).css('top', rand(250, 475));

    $('body').mousedown(function (e) {
        if ($(e.target).hasClass('node')) {
            var node = e.target;

            $('body').mousemove(function (e) {
                var x = e.pageX;
                var y = e.pageY;
                $(node).css('left', x);
                $(node).css('top', y);
            });

            $('body').mouseup(function (e) {
                $('body').off('mousemove');
                $('body').off('mouseup');
            });
        }
    });
});

var draw = function () {
    context.clearRect(0, 0, 500, 500);

    var drawTriangle = function (wireframe, image, tri) {
        console.log(tri);
        if (wireframe) {
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(tri.p0.x, tri.p0.y);
            context.lineTo(tri.p1.x, tri.p1.y);
            context.lineTo(tri.p2.x, tri.p2.y);
            context.lineTo(tri.p0.x, tri.p0.y);
            context.stroke();
            context.closePath();
        }

        if (image) {
            drawTriangle(context, image,
                tri.p0.x, tri.p0.y,
                tri.p1.x, tri.p1.y,
                tri.p2.x, tri.p2.y,
                tri.t0.u, tri.t0.v,
                tri.t1.u, tri.t1.v,
                tri.t2.u, tri.t2.v);
        }
    };

    var p1 = new Point(parseInt($(controls[0]).css('left')) + 6, parseInt($(controls[0]).css('top')) + 6);
    var p2 = new Point(parseInt($(controls[1]).css('left')) + 6, parseInt($(controls[1]).css('top')) + 6);
    var p3 = new Point(parseInt($(controls[2]).css('left')) + 6, parseInt($(controls[2]).css('top')) + 6);
    var p4 = new Point(parseInt($(controls[3]).css('left')) + 6, parseInt($(controls[3]).css('top')) + 6);

    // store triangles
    var triangles = [];

    // generate subdivision
    var subs = 10;
    var divs = 10;

    var dx1 = p4.x - p1.x;
    var dy1 = p4.y - p1.y;
    var dx2 = p3.x - p2.x;
    var dy2 = p3.y - p2.y;

    var imgW = image.naturalWidth;
    var imgH = image.naturalHeight;

    for (var sub = 0; sub < subs; ++sub) {
        var curRow = sub / subs;
        var nextRow = (sub + 1) / subs;

        var curRowX1 = p1.x + dx1 * curRow;
        var curRowY1 = p1.y + dy1 * curRow;

        var curRowX2 = p2.x + dx2 * curRow;
        var curRowY2 = p2.y + dy2 * curRow;

        var nextRowX1 = p1.x + dx1 * nextRow;
        var nextRowY1 = p1.y + dy1 * nextRow;

        var nextRowX2 = p2.x + dx2 * nextRow;
        var nextRowY2 = p2.y + dy2 * nextRow;

        for (var div = 0; div < divs; ++div) {
            var curCol = div / divs;
            var nextCol = (div + 1) / divs;

            var dCurX = curRowX2 - curRowX1;
            var dCurY = curRowY2 - curRowY1;
            var dNextX = nextRowX2 - nextRowX1;
            var dNextY = nextRowY2 - nextRowY1;

            var p1x = curRowX1 + dCurX * curCol;
            var p1y = curRowY1 + dCurY * curCol;

            var p2x = curRowX1 + (curRowX2 - curRowX1) * nextCol;
            var p2y = curRowY1 + (curRowY2 - curRowY1) * nextCol;

            var p3x = nextRowX1 + dNextX * nextCol;
            var p3y = nextRowY1 + dNextY * nextCol;

            var p4x = nextRowX1 + dNextX * curCol;
            var p4y = nextRowY1 + dNextY * curCol;

            var u1 = curCol * imgW;
            var u2 = nextCol * imgW;
            var v1 = curRow * imgH;
            var v2 = nextRow * imgH;

            var triangle1 = new Triangle(
                new Point(p1x, p1y),
                new Point(p3x, p3y),
                new Point(p4x, p4y),
                new TextCoord(u1, v1),
                new TextCoord(u2, v2),
                new TextCoord(u1, v2)
            );

            var triangle2 = new Triangle(
                new Point(p1x, p1y),
                new Point(p2x, p2y),
                new Point(p3x, p3y),
                new TextCoord(u1, v1),
                new TextCoord(u2, v1),
                new TextCoord(u2, v2)
            );

            drawTriangle(true, image, triangle1);
            drawTriangle(true, image, triangle2);

            triangles.push(triangle1);
            triangles.push(triangle2);
        }
    }
};

// point class

var Point = function (x, y) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
};

var p = Point.prototype;

p.length = function (point) {
    point = point ? point : new Point();
    var xs = 0,
        ys = 0;
    xs = point.x - this.x;
    xs = xs * xs;

    ys = point.y - this.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys);
};

var TextCoord = function (u, v) {
    this.u = u ? u : 0;
    this.v = v ? v : 0;
};

var Triangle = function (p0, p1, p2, t0, t1, t2) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;

    this.t0 = t0;
    this.t1 = t1;
    this.t2 = t2;
};