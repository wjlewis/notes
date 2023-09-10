/*

Need to distinguish abstractions from parenthesized terms:

(a, b, c) => ...
(a) => ...
(a => a)(b)
^^

Term = Name ["=>" Term]
     | "(" Term ["," Term]* ")" ["=>" Term]
 
Treat {"=>" Term} and {"(" Term(",")+ ")"} as postfix operators?

- If we see "=>", the current term must either be a name or a tuple of _names_
- If we see "(", the current term must either be a name or be parenthesized
- If we don't see "=>", the current term must _not_ be a tuple

 */

function parseExpr(ts) {
  let term;
  let parend = false;

  const next = ts.next();
  if (next.type === 'NAME') {
    term = ts.next();
  } else if (next.type === 'LPAREN') {
    const terms = parseParendOrTuple(ts);
    parend = true;
  } else if (next.type === 'LCURLY') {
    // Block
  } else {
    throw new Error();
  }

  const peek = ts.peek();
  if (peek.type === 'LPAREN') {
    // Application
    if (!simpleTerm && !parend) {
      throw new Error('operator must be parenthesized');
    }
  } else if (peek.type === 'ARROW') {
    // Abstraction.
    // Check params.
  }
}

function parseParendOrTuple(ts) {
  const terms = [];

  terms.push(parseExpr(ts));

  while (ts.hasMore() && ts.peek().type !== 'RPAREN') {
    ts.expect('COMMA');

    if (ts.peek().type === 'RPAREN') {
      break;
    }

    terms.push(parseExpr(ts));
  }

  ts.expect('RPAREN');

  return terms;
}
