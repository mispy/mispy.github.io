window.Geometry = {};

Geometry.rectHitsRect = function(r1x, r1y, r1Width, r1Height, r2x, r2y, r2Width, r2Height) {
  return !(r2x > r1x+r1Width || 
           r2x+r2Width < r1x || 
           r2y > r1y+r1Height ||
           r2y+r2Height < r1y);
}

Geometry.facingFromLine = function(cx, cy, tx, ty) {
  if (Math.abs(tx-cx) > Math.abs(ty-cy)) {
    if (tx > cx) {
      return 'right';
    } else {
      return 'left';
    }
  } else {
    if (ty > cy) {
      return 'down';
    } else {
      return 'up';
    }
  }
}

Geometry.lineHitsRect = function(x1, y1, x2, y2, rectX, rectY, rectWidth, rectHeight) {
  var rx1 = rectX;
  var ry1 = rectY;
  var rx2 = rectX+rectWidth;
  var ry2 = rectY+rectHeight;

  return (
    Geometry.lineHitsLine(x1, y1, x2, y2, rx1, ry1, rx2, ry1) ||
    Geometry.lineHitsLine(x1, y1, x2, y2, rx1, ry1, rx1, ry2) ||
    Geometry.lineHitsLine(x1, y1, x2, y2, rx2, ry2, rx2, ry1) ||
    Geometry.lineHitsLine(x1, y1, x2, y2, rx2, ry2, rx1, ry2)
  )
}

Geometry.lineHitsLine = function(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    var s1_x = p1_x - p0_x;
    var s1_y = p1_y - p0_y;
    var s2_x = p3_x - p2_x;
    var s2_y = p3_y - p2_y;

    var s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    var t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }

    return false; // No collision
}
