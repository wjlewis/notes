// An urn contains 3 red balls, 2 blue balls, and 5 yellow balls.
// What is the probability of selecting 2 red balls, without replacing the
// first?

function main() {
  console.log(`Without replacement: ${run(drawNoReplace)}`);
  console.log(`With replacement: ${run(drawReplace)}`);
}

function run(sample) {
  const urn = ['R', 'R', 'R', 'B', 'B', 'Y', 'Y', 'Y', 'Y', 'Y'];

  const results = {};

  const experimentCount = 1_000_000;
  for (let i = 0; i < experimentCount; i++) {
    const [ball1, urn1] = sample(urn);
    const [ball2] = sample(urn1);
    const key = `${ball1}${ball2}`;
    results[key] = (results[key] ?? 0) + 1;
  }

  const total = sum(Object.values(results));
  return results.RR / total;
}

/**
 * Draw a ball without replacing it.
 * Return the color of the ball, along with the updated urn.
 *
 * @param urn An array of balls (strings).
 */
function drawNoReplace(urn) {
  if (urn.length === 0) {
    throw new Error("can't draw from an empty urn");
  }

  const i = randomInRange(urn.length);
  const ball = urn[i];
  const urn1 = splice(urn, i);

  return [ball, urn1];
}

/**
 * Draw a ball _and_ replace it.
 */
function drawReplace(urn) {
  if (urn.length === 0) {
    throw new Error("can't draw from an empty urn");
  }

  const i = randomInRange(urn.length);
  const ball = urn[i];

  return [ball, urn];
}

function randomInRange(n) {
  return Math.floor(n * Math.random());
}

function splice(xs, i) {
  const out = [];

  for (let j = 0; j < xs.length; j++) {
    if (j === i) {
      continue;
    }
    out.push(xs[j]);
  }

  return out;
}

function sum(xs) {
  return xs.reduce((sum, x) => sum + x, 0);
}

main();
