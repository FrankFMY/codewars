function assemblerInterpreter(program) {
  var ip = 0,
    stack = [],
    reg = {},
    labels = {},
    c,
    output = "";

  var code = program.split("\n").reduce((p, v) => {
    let m = v
      .replace(/(?<='[^']*'.*)*;.*/g, "")
      .replace(/^(\w+):/, (m, g) => ((labels[g] = p.length), ""))
      .trim()
      .match(/(\w+)( +.*)?/);
    if (m && m[1]) {
      let args = [];
      m[2] &&
        m[2].replace(
          /('[^']*'|[^,']+)(,|$)/g,
          (m, g) => (args.push(g.trim().replace(/^'|'$/g, "")), "")
        );
      p.push([m[1], args]);
    }
    return p;
  }, []);

  const instructions = {
    mov: (x, y) => {
      (reg[x] = isNaN(+y) ? reg[y] : +y), ip++;
    },
    inc: (x) => {
      reg[x]++, ip++;
    },
    dec: (x) => {
      reg[x]--, ip++;
    },
    add: (x, y) => {
      (reg[x] += isNaN(+y) ? reg[y] : +y), ip++;
    },
    sub: (x, y) => {
      (reg[x] -= isNaN(+y) ? reg[y] : +y), ip++;
    },
    mul: (x, y) => {
      (reg[x] *= isNaN(+y) ? reg[y] : +y), ip++;
    },
    div: (x, y) => {
      (reg[x] /= isNaN(+y) ? reg[y] : +y), (reg[x] |= 0), ip++;
    },
    jmp: (lbl) => {
      ip = labels[lbl];
    },
    cmp: (x, y) => {
      (c = (isNaN(+x) ? reg[x] : +x) - (isNaN(+y) ? reg[y] : +y)), ip++;
    },
    jne: (lbl) => {
      c != 0 ? (ip = labels[lbl]) : ip++;
    },
    je: (lbl) => {
      c == 0 ? (ip = labels[lbl]) : ip++;
    },
    jge: (lbl) => {
      c >= 0 ? (ip = labels[lbl]) : ip++;
    },
    jg: (lbl) => {
      c > 0 ? (ip = labels[lbl]) : ip++;
    },
    jle: (lbl) => {
      c <= 0 ? (ip = labels[lbl]) : ip++;
    },
    jl: (lbl) => {
      c < 0 ? (ip = labels[lbl]) : ip++;
    },
    call: (lbl) => {
      stack.push(ip + 1), (ip = labels[lbl]);
    },
    ret: () => {
      ip = stack.pop();
    },
    msg: (...args) => {
      (output += args.reduce(
        (s, v) => s + (reg[v] !== undefined ? reg[v] : v),
        ""
      )),
        ip++;
    },
  };

  while (ip < code.length) {
    let [name, args] = code[ip];
    if (name === "end") return output;
    instructions[name](...args);
  }

  return -1;
}
