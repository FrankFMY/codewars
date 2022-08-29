function voronoi_areas(points) {
  if (points.length <= 3) return Array(points.length).fill(-1);
  points = points.map(({ x, y }) => [x, y]);

  return points.map((p) => {
    let otherPts = points
      .map((q) => ({ xy: q, a: angle(p, q) }))
      .sort((a, b) => a.a - b.a);
    otherPts.shift();
    let dists = otherPts.map((q) => dist(p, q.xy)),
      minDi = dists.indexOf(Math.min(...dists));

    otherPts = otherPts
      .slice(minDi)
      .concat(otherPts.slice(0, minDi))
      .map((q) => q.xy);
    otherPts.push(otherPts[0]);

    let q = otherPts[0],
      ccs = [];
    otherPts.slice(1).forEach((r) => {
      if (q == otherPts[0] && r == otherPts[0]) return (ccs = []);
      if (points.every((s) => !inCircle(p, q, r, s))) {
        ccs.push(circumcenter(p, q, r));
        q = r;
      }
    });

    let area =
      ccs.reduce((ttl, cc, j) => {
        let [px, py] = p,
          [qx, qy] = cc,
          [rx, ry] = ccs[j + 1] || ccs[0];
        return ttl + (px * (qy - ry) + qx * (ry - py) + rx * (py - qy)) / 2;
      }, 0) || -1;
    return area < 1 ? -1 : area;
  });
}

function angle(a, b) {
  if (a == b) return -1;
  let [dx, dy] = [0, 1].map((c) => a[c] - b[c]),
    p = dx / (Math.abs(dx) + Math.abs(dy));
  return (dy > 0 ? 3 - p : 1 + p) / 4;
}

function dist([ax, ay], [bx, by]) {
  return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
}

function inCircle([ax, ay], [bx, by], [cx, cy], [px, py]) {
  let dx = ax - px,
    dy = ay - py,
    ex = bx - px,
    ey = by - py,
    fx = cx - px,
    fy = cy - py;
  return (
    (dx * dx + dy * dy) * (ex * fy - fx * ey) -
      (ex * ex + ey * ey) * (dx * fy - fx * dy) +
      (fx * fx + fy * fy) * (dx * ey - ex * dy) >
    1e-10
  );
}

function circumcenter([ax, ay], [bx, by], [cx, cy]) {
  let dx = bx - ax,
    dy = by - ay,
    ex = cx - ax,
    ey = cy - ay,
    bl = dx * dx + dy * dy,
    cl = ex * ex + ey * ey,
    d = 0.5 / (dx * ey - dy * ex);
  return [ax + (ey * bl - dy * cl) * d, ay + (dx * cl - ex * bl) * d];
}
