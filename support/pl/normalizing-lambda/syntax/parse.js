export function parse(source) {
  const ts = lex(source);
  const term = parseTerm(ts);
  if (ts.length > 0) {
    throw new Error('extraneous input');
  }
  return term;
}

function lex(source) {
  const re = /[a-z][a-z0-9]*|->|\(|\)|\\/g;
  return source.match(re);
}

// Term = T1*
// T1   = Name
//      | "\" Name+ "->" Term
//      | "(" Term ")"
function parseTerm(ts) {
  const first = parseT1(ts);

  const rands = [];
  while (ts.length > 0 && ts[0] !== ')') {
    rands.push(parseT1(ts));
  }

  if (rands.length === 0) {
    return first;
  } else {
    return {
      type: 'APP',
      rator: first,
      rands,
    };
  }
}

function parseT1(ts) {
  if (isName(ts[0])) {
    return { type: 'NAME', text: ts.shift() };
  } else if (ts[0] === '\\') {
    ts.shift();
    const params = [];
    while (isName(ts[0])) {
      params.push(ts.shift());
    }
    if (ts[0] !== '->') {
      throw new Error('expected "->"');
    }
    ts.shift();
    const body = parseTerm(ts);
    return {
      type: 'FN',
      params,
      body,
    };
  } else if (ts[0] === '(') {
    ts.shift();
    const inner = parseTerm(ts);
    if (ts[0] !== ')') {
      throw new Error('unmatched "("');
    }
    ts.shift();
    return inner;
  } else {
    throw new Error('not a T1');
  }
}

function isName(t) {
  return /[a-z][a-z0-9]*/.test(t);
}

export function show(term) {
  if (term.type === 'NAME') {
    return term.text;
  } else if (term.type === 'FN') {
    const { params, body } = term;
    return `\\${params.join(' ')} -> ${show(body)}`;
  } else if (term.type === 'APP') {
    const { rator, rands } = term;
    return [showWithParen(rator), ...rands.map(showWithParen)].join(' ');
  }
}

function showWithParen(term) {
  const shown = show(term);
  return term.type === 'NAME' ? shown : `(${shown})`;
}
