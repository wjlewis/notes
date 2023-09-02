// Redex-hunting

import { parse, show } from './syntax/index.js';

function normalize(term) {
  while (true) {
    const [stepped, madeProgress] = step(term);
    term = stepped;
    if (!madeProgress) {
      return term;
    }
  }
}

// Reduce a single redex if possible. Return an array with 2 elements:
// 1. The (possibly) reduced term.
// 2. `true` if the term was reduced, and `false` otherwise.
function step(term) {
  if (term.type === 'ADDR') {
    return [term, false];
  } else if (term.type === 'FN') {
    const [body, progress] = step(term.body);
    return [{ ...term, body }, progress];
  } else if (term.type === 'APP') {
    if (term.rator.type === 'FN') {
      // Redex.
      // Shift unbound rand addrs _up_ by one in anticipation of being shifted
      // back _down_.
      const arg = shift(term.rand, 1);

      // Substitute arg for the bound addr in the operator's body.
      const afterSubst = subst(term.rator.body, arg);

      // Shift unbound addrs _down_ by 1 to account for the fact that the binder
      // has been removed.
      return [shift(afterSubst, -1), true];
    } else {
      // The operator isn't an abstraction, but it might be reducible to an
      // abstraction (which would reveal a redex on a subsequent step). Try and
      // reduce it.
      const [rator, progress] = step(term.rator);

      if (progress) {
        return [{ ...term, rator }, progress];
      } else {
        // If the operator was already reduced, try and reduce the operand.
        const [rand, progress] = step(term.rand);
        return [{ ...term, rand }, progress];
      }
    }
  }
}

// Shift unbound indexes by `n`.
function shift(term, n, binderCount = 0) {
  if (term.type === 'ADDR') {
    if (term.addr >= binderCount) {
      return {
        ...term,
        addr: term.addr + n,
      };
    } else {
      return term;
    }
  } else if (term.type === 'FN') {
    return {
      ...term,
      body: shift(term.body, n, binderCount + 1),
    };
  } else if (term.type === 'APP') {
    return {
      ...term,
      rator: shift(term.rator, n, binderCount),
      rand: shift(term.rand, n, binderCount),
    };
  }
}

function subst(host, sub, binderCount = 0) {
  if (host.type === 'ADDR') {
    if (host.addr === binderCount) {
      return shift(sub, binderCount);
    } else {
      return host;
    }
  } else if (host.type === 'FN') {
    return {
      ...host,
      body: subst(host.body, sub, binderCount + 1),
    };
  } else if (host.type === 'APP') {
    return {
      ...host,
      rator: subst(host.rator, sub, binderCount),
      rand: subst(host.rand, sub, binderCount),
    };
  }
}

const fact4 = `
(\\self -> \\n -> (n (\\p -> \\t f -> f) (\\t f -> t))
                  (\\s z -> s z)
                  ((\\m n -> m (\\p -> \\s z -> p s (n s z)) (\\s z -> z))
                   n
                   ((self self)
                    ((\\n -> 
                      (n
                       (\\p -> (\\f s -> \\elim -> elim f s)
                               (\\s z -> s ((p \\f s -> f) s z))
                               (p \\f s -> f))
                       ((\\f s -> \\elim -> elim f s)
                        (\\s z -> z)
                        (\\s z -> z)))
                      (\\f s -> s))
                     n))))
(\\self -> \\n -> (n (\\p -> \\t f -> f) (\\t f -> t))
                  (\\s z -> s z)
                  ((\\m n -> m (\\p -> \\s z -> p s (n s z)) (\\s z -> z))
                   n
                   ((self self)
                    ((\\n -> 
                      (n
                       (\\p -> (\\f s -> \\elim -> elim f s)
                               (\\s z -> s ((p \\f s -> f) s z))
                               (p \\f s -> f))
                       ((\\f s -> \\elim -> elim f s)
                        (\\s z -> z)
                        (\\s z -> z)))
                      (\\f s -> s))
                     n))))
(\\s z -> s (s (s (s (s (s z))))))
`;

const normTest = `
(\\x y -> y) ((\\x -> x x) \\x -> x x) (\\x -> x)
`;

const stackTest = `
(\\x -> x x) \\x -> x x
`;

console.log(show(normalize(parse(fact4))));
