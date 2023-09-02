process.stdin
  .setEncoding('utf-8')
  .map(chunk => chunk.replace(/\\\\/g, '\\'))
  .pipe(process.stdout);
