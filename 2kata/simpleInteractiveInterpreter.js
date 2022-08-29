Array.prototype.last = function () {
  return this[this.length - 1];
};

function Interpreter() {
  this.vars = {};
  this.functions = {};
}

Interpreter.prototype.tokenize = function (program) {
  if (program === "") return [];

  var regex = /\s*([-+*\/\%=\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g;
  return program.split(regex).filter(function (s) {
    return !s.match(/^\s*$/);
  });
};

Interpreter.prototype.input = function (expr) {
  var _this = this;
  var tokens = this.tokenize(expr);
  var ops = [];
  var stack = [];

  tokens.forEach(function (token) {
    if (_this.isOperator(token)) {
      if (
        _this.getOperatorRank(ops.last()) < _this.getOperatorRank(token) ||
        (stack.length >= 2 && stack[stack.length - 2] == "(")
      ) {
        ops.push(token);
      } else {
        var b = stack.pop();
        var a = stack.pop();
        stack.push(_this.doOp(a, ops.pop(), b));
        ops.push(token);
      }
    } else if (token == "(") {
      stack.push(token);
    } else if (_this.isNumber(token)) {
      stack.push(token);
    } else if (_this.isIdentifier(token)) {
      stack.push(token);
    } else if (token == ")") {
      while (stack.length > 0) {
        var b = stack.pop();
        var a = stack.pop();
        if (stack.last() == "(") {
          stack.pop();
          stack.push(_this.doOp(a, ops.pop(), b));
          break;
        }
      }
    }
  });

  while (stack.length > 1) {
    var b = stack.pop();
    var a = stack.pop();
    stack.push(_this.doOp(a, ops.pop(), b));
  }
  return tokens.length > 0 ? _this.getVal(stack.pop()) : "";
};

Interpreter.prototype.isDigit = function (token) {
  return token.length == 1 && token >= "0" && token <= "9";
};

Interpreter.prototype.isLetter = function (token) {
  return (
    token.length == 1 &&
    ((token >= "a" && token <= "z") || (token >= "A" && token <= "Z"))
  );
};

Interpreter.prototype.isOperator = function (token) {
  return ["+", "-", "*", "/", "%", "="].indexOf(token) >= 0;
};

Interpreter.prototype.getOperatorRank = function (token) {
  switch (token) {
    case "=":
      return 0;
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
    case "%":
      return 2;
  }
  return -1;
};

Interpreter.prototype.isIdentifier = function (token) {
  var regex = /^[a-zA-Z]([a-zA-Z_0-9]*)?$/g;
  return regex.test(token);
};

Interpreter.prototype.isNumber = function (token) {
  var regex = /^[\+\-]?\d*[\.]?\d+$/g;
  return regex.test(token);
};
Interpreter.prototype.getVal = function (a) {
  if (this.isNumber(a)) {
    a = Number(a);
  } else if (this.isIdentifier(a)) {
    var aa = this.vars[a];
    if (typeof aa === "undefined") {
      throw "No variable with name '" + a + "' was found.";
    }
    a = aa;
  }
  return a;
};
Interpreter.prototype.doOp = function (a, op, b) {
  if (op != "=") {
    var aa = this.getVal(a);
    var bb = this.getVal(b);

    switch (op) {
      case "+":
        return aa + bb;
      case "-":
        return aa - bb;
      case "*":
        return aa * bb;
      case "/":
        return aa / bb;
      case "%":
        return aa % bb;
      case "=":
        this.vars[a] = bb;
        return a;
    }
  } else {
    this.vars[a] = this.getVal(b);
    return a;
  }
};
