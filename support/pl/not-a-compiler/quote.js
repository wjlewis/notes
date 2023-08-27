process.stdin
  .setEncoding('utf-8')
  // Replace backticks (`), dollar signs ($), and escape characters (\) with an
  // escaped version, e.g. $ -> \$.
  .map(chunk => chunk.replace(/`|\$|\\/g, c => `\\${c}`))
  .pipe(process.stdout);
