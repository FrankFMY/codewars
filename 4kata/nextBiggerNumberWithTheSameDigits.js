function nextBigger(n) {
  console.log(n);
  var chars = n.toString().split("");
  var i = chars.length - 1;
  while (i > 0) {
    if (chars[i] > chars[i - 1]) break;
    i--;
  }
  if (i == 0) return -1;
  var suf = chars.splice(i).sort();
  var t = chars[chars.length - 1];
  for (i = 0; i < suf.length; ++i) {
    if (suf[i] > t) break;
  }
  chars[chars.length - 1] = suf[i];
  suf[i] = t;
  var res = chars.concat(suf);
  var num = parseInt(res.join(""));
  console.log("->" + num);
  return num;
}
