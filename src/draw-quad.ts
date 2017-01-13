// Based on: jsgl.js https://github.com/spoulson/Code-snippets/blob/master/Javascript/jsgl/jsgl.js
// For pixel rounding purposes during clipping:
// (x0,y0) = (top, left)
// (x1,y1) = (top, right)
// (x2,y2) = (bottom, right)
// (x3,y3) = (bottom, left)
export function drawQuad(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    sx0: number,
    sy0: number,
    sx1: number,
    sy1: number,
    sx2: number,
    sy2: number,
    sx3: number,
    sy3: number,
    wireframe = false
) {
    if (wireframe) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#00FF00';
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x0, y0);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = '#0000FF';
        ctx.beginPath();
        ctx.moveTo(sx0, sy0);
        ctx.lineTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.lineTo(sx3, sy3);
        ctx.lineTo(sx0, sy0);
        ctx.stroke();
        ctx.closePath();
    }

    // console.log(`Target: (${x0},${y0})-(${x1},${y1})-(${x2},${y2})`);
    // console.log(`Source: (${sx0},${sy0})-(${sx1},${sy1})-(${sx2},${sy2})`);

    ctx.save();

    // Clip the output to the on-screen triangle boundaries.
    ctx.beginPath();
    // ctx.moveTo(x0, y0);
    // ctx.lineTo(x1, y1);
    // ctx.lineTo(x2, y2);
    // ctx.lineTo(x3, y3);

    // Remove border lines
    ctx.moveTo(Math.floor(x0), Math.floor(y0));
    ctx.lineTo(Math.ceil(x1), Math.floor(y1));
    ctx.lineTo(Math.ceil(x2), Math.ceil(y2));
    ctx.lineTo(Math.floor(x3), Math.ceil(y3));

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
    let denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
    if (denom === 0) {
        return;
    }
    let m11 = - (sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
    let m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
    let m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
    let m22 = - (sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
    let dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
    let dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

    ctx.transform(m11, m12, m21, m22, dx, dy);

    // Draw the whole image.  Transform and clip will map it onto the
    // correct output triangle.
    //
    // TODO: figure out if drawImage goes faster if we specify the rectangle that
    // bounds the source coords.
    ctx.drawImage(image, 0, 0);
    ctx.restore();
};