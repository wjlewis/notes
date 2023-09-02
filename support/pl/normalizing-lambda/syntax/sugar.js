export function desugar(term) {
  if (term.type === 'NAME') {
    return term;
  } else if (term.type === 'FN') {
    return term.params.reduceRight(
      (body, param) => ({
        type: 'FN',
        param,
        body,
      }),
      desugar(term.body)
    );
  } else if (term.type === 'APP') {
    return term.rands.reduce(
      (rator, rand) => ({
        type: 'APP',
        rator,
        rand: desugar(rand),
      }),
      desugar(term.rator)
    );
  }
}

export function resugar(term) {
  if (term.type === 'NAME') {
    return term;
  } else if (term.type === 'FN') {
    const body = resugar(term.body);

    if (body.type === 'FN') {
      return {
        type: 'FN',
        params: [term.param, ...body.params],
        body: body.body,
      };
    } else {
      return {
        type: 'FN',
        params: [term.param],
        body,
      };
    }
  } else if (term.type === 'APP') {
    const rator = resugar(term.rator);
    const rand = resugar(term.rand);

    if (rator.type === 'APP') {
      return {
        type: 'APP',
        rator: rator.rator,
        rands: [...rator.rands, rand],
      };
    } else {
      return {
        type: 'APP',
        rator,
        rands: [rand],
      };
    }
  }
}
