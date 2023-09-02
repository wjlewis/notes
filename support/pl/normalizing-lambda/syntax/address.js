export function address(term, bound = []) {
  if (term.type === 'NAME') {
    const addr = bound.indexOf(term.text);
    if (addr < 0) {
      throw new Error(`unbound name: "${term.text}"`);
    }
    return {
      type: 'ADDR',
      addr,
    };
  } else if (term.type === 'FN') {
    return {
      type: 'FN',
      param: term.param,
      body: address(term.body, [term.param, ...bound]),
    };
  } else if (term.type === 'APP') {
    return {
      type: 'APP',
      rator: address(term.rator, bound),
      rand: address(term.rand, bound),
    };
  }
}

export function unaddress(term, bound = []) {
  if (term.type === 'ADDR') {
    const text = bound[term.addr];
    return {
      type: 'NAME',
      text,
    };
  } else if (term.type === 'FN') {
    const param = freshParam(term.param, bound);
    return {
      type: 'FN',
      param,
      body: unaddress(term.body, [param, ...bound]),
    };
  } else if (term.type === 'APP') {
    return {
      type: 'APP',
      rator: unaddress(term.rator, bound),
      rand: unaddress(term.rand, bound),
    };
  }
}

function freshParam(like, avoid) {
  let candidate = like;
  let suffix = 1;
  while (avoid.includes(candidate)) {
    candidate = `${like}${suffix}`;
    suffix++;
  }
  return candidate;
}
