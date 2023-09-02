import * as P from './parse.js';
import { desugar, resugar } from './sugar.js';
import { address, unaddress } from './address.js';

export function parse(source) {
  return address(desugar(P.parse(source)));
}

export function show(term) {
  return P.show(resugar(unaddress(term)));
}
