#!/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filepath = path.join(__dirname, './root', req.url);
  const stream = fs.createReadStream(filepath, 'utf-8');

  stream.on('error', () => {
    stream.close();
    const errorPath = path.join(__dirname, './root/404.html');
    fs.createReadStream(errorPath, 'utf-8').pipe(res);
  });

  stream.pipe(res);
});

server.listen(8080, () => console.log('listening on 8080...'));
