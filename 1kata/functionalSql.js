Array.prototype.findIndex = function (fn) {
  for (let i = 0; i < this.length; i++) if (fn(this[i])) return i;
  return -1;
};
function product(a, arr) {
  if (arr.length == 0) return a;
  let b = arr[0],
    res = [];
  for (let x of a) for (let y of b) res.push(x.concat(y));
  return product(res, arr.slice(1));
}
function query() {
  let s = { where: [], having: [] },
    q = {
      select: function (fn) {
        if (s.select) throw new Error("Duplicate SELECT");
        s.select = fn || ((x) => x);
        return q;
      },
      from: function (a, ...arr) {
        if (s.from) throw new Error("Duplicate FROM");
        s.from = () =>
          arr.length == 0
            ? a
            : product(
                a.map((x) => [x]),
                arr
              );
        return q;
      },
      where: function (...fns) {
        s.where.push((x) => fns.some((fn) => fn(x)));
        return q;
      },
      orderBy: function (fn) {
        if (s.orderBy) throw new Error("Duplicate ORDERBY");
        s.orderBy = fn;
        return q;
      },
      groupBy: function (...fns) {
        if (s.groupBy) throw new Error("Duplicate GROUPBY");
        s.groupBy = (a) =>
          a.reduce((res, row) => {
            let a = res,
              b;
            for (let fn of fns) {
              let group = fn(row);
              let i = a.findIndex((x) => x[0] == group);
              if (i < 0) a.push([group, (a = [])]);
              else a = a[i][1];
            }
            a.push(row);
            return res;
          }, []);
        return q;
      },
      having: function (...fns) {
        s.having.push((x) => fns.some((fn) => fn(x)));
        return q;
      },
      execute: function () {
        let res = s.from ? s.from() : [];
        res = res.filter((x) => s.where.every((fn) => fn(x)));
        if (s.groupBy) res = s.groupBy(res);
        res = res.filter((x) => s.having.every((fn) => fn(x)));
        if (s.orderBy) res.sort(s.orderBy);
        return s.select ? res.map(s.select) : res;
      },
    };
  return q;
}
