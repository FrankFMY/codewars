function* rails(rn, ln) {
  for (var rc = 0; rc < rn; ++rc) {
    var rv = rc,
      rd = rc;
    while (rv < ln) {
      yield rv;
      rv += 2 * (rn - 1 - (rn == rd + 1 ? 0 : rd));
      rd = rn - 1 - rd;
    }
  }
}

function encodeRailFenceCipher(s, numberRails) {
  return Array.from(rails(numberRails, s.length))
    .map(function (i) {
      return s[i];
    })
    .join("");
}

function decodeRailFenceCipher(s, numberRails) {
  var r = [];
  for (var [i, k] of Array.from(rails(numberRails, s.length)).entries()) {
    r[k] = s[i];
  }
  return r.join("");
}
