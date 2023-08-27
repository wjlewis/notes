const fs = require('fs');

function compile(source) {
  const interpreterSource = `
function lex(source) {
  const re = /\\(|\\)|\\[|\\]|'|[a-z+*\\-<>=!?]+|\\d+|#(t|f)/g;
  const parts = source.match(re);

  // Convert '#t' and '#f' into \`true\` and \`false\`, and numeric strings into
  // numbers.
  return parts.map(part => {
    if (['#t', '#f'].includes(part)) {
      return part === '#t';
    } else if (!isNaN(part)) {
      return Number(part);
    } else {
      return part;
    }
  });
}

function parseProgram(tokens) {
  const exprs = [];
  while (tokens.length > 0) {
    exprs.push(parseExpr(tokens));
  }
  return exprs;
}

function parseExpr(tokens) {
  if (['(', '['].includes(tokens[0])) {
    return parseList(tokens);
  } else if (tokens[0] === "'") {
    tokens.shift();
    const quoted = parseExpr(tokens);
    return ['quote', quoted];
  } else {
    return tokens.shift();
  }
}

function parseList(tokens) {
  const closers = { '(': ')', '[': ']' };
  // Determine if we're looking for a ')' or ']'.
  const closer = closers[tokens.shift()];

  const exprs = [];
  while (tokens.length > 0 && tokens[0] !== closer) {
    exprs.push(parseExpr(tokens));
  }
  // Consume the closing token.
  tokens.shift();

  return exprs;
}

function evalProgram(program, env) {
  for (const expr of program) {
    evalExpr(expr, env);
  }
}

function evalExpr(expr, env) {
  if (['number', 'boolean'].includes(typeof expr)) {
    return expr;
  } else if (typeof expr === 'string') {
    return lookup(expr, env);
  } else {
    const [first, ...rest] = expr;

    if (first === 'if') {
      const [testExpr, trueExpr, falseExpr] = rest;
      const isTrue = evalExpr(testExpr, env);

      if (isTrue) {
        return evalExpr(trueExpr, env);
      } else {
        return evalExpr(falseExpr, env);
      }
    } else if (first === 'lambda') {
      const [params, body] = rest;
      return { params, body, env };
    } else if (first === 'quote') {
      return rest[0];
    } else if (first === 'let') {
      return evalExpr(desugarLet(expr), env);
    } else if (first === 'set!') {
      const [name, rhs] = rest;
      const value = evalExpr(rhs, env);
      assign(name, value, env);
      return value;
    } else if (first === 'cond') {
      return evalExpr(desugarCond(expr), env);
    } else if (first === 'define') {
      const isDefiningName = typeof rest[0] === 'string';
      if (isDefiningName) {
        const [name, rhs] = rest;
        env.bindings[name] = evalExpr(rhs, env);
      } else {
        const [[name, ...params], body] = rest;
        const lambda = ['lambda', params, body];
        env.bindings[name] = evalExpr(lambda, env);
      }
    } else if (first === 'begin') {
      const init = rest.slice(0, -1);
      const last = rest[rest.length - 1];
      for (const expr of init) {
        evalExpr(expr, env);
      }
      return evalExpr(last, env);
    } else {
      const [rator, ...rands] = expr;
      const op = evalExpr(rator, env);
      const args = rands.map(rand => evalExpr(rand, env));

      if (typeof op === 'function') {
        return op(...args);
      } else {
        const { params, body, env } = op;
        const bindings = Object.fromEntries(zip(params, args));
        const env1 = { bindings, base: env };
        return evalExpr(body, env1);
      }
    }
  }
}

function desugarLet(expr) {
  const [_let, bindings, body] = expr;
  const params = bindings.map(([param, _rand]) => param);
  const rands = bindings.map(([_param, rand]) => rand);

  const lambda = ['lambda', params, body];
  return [lambda, ...rands];
}

function desugarCond(expr) {
  const [_cond, ...clauses] = expr;

  return clauses.reduceRight(
    (falseExpr, [testExpr, trueExpr]) => ['if', testExpr, trueExpr, falseExpr],
    0
  );
}

function lookup(name, env) {
  if (name in env.bindings) {
    return env.bindings[name];
  } else if (env.base) {
    return lookup(name, env.base);
  } else {
    throw new Error(\`unbound name: \${name}\`);
  }
}

function assign(name, value, env) {
  if (name in env.bindings) {
    env.bindings[name] = value;
  } else if (env.base) {
    assign(name, value, env.base);
  } else {
    throw new Error(\`unbound name: \${name}\`);
  }
}

function zip(xs, ys) {
  return xs.map((x, i) => [x, ys[i]]);
}

function interpret(source) {
  const env0 = {
    bindings: {
      '+': (l, r) => l + r,
      '-': (l, r) => l - r,
      '*': (l, r) => l * r,
      '<': (l, r) => l < r,
      '=': (l, r) => l === r,
      'number?': v => typeof v === 'number',
      'boolean?': v => typeof v === 'boolean',
      'symbol?': v => typeof v === 'string',
      'eq?': (l, r) => l === r,
      'empty?': xs => xs.length === 0,
      cons: (head, tail) => [head, ...tail],
      head: xs => xs[0],
      tail: xs => xs.slice(1),
      debug: v => console.log(showValue(v)),
    },
  };

  evalProgram(parseProgram(lex(source)), env0);
}

function showValue(v) {
  if (Array.isArray(v)) {
    return \`(\${v.map(showValue).join(' ')})\`;
  } else if (typeof v === 'object') {
    return '#<closure>';
  } else {
    return v.toString();
  }
}
`;

  return `
${interpreterSource}

interpret(\`${source}\`);
`;
}

const source = fs.readFileSync(0, 'utf-8');
fs.writeFileSync(1, compile(source));
