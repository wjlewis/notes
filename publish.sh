#!/bin/sh

echo "Cleaning dist"
rm -rf dist
mkdir dist

echo "Copying artifacts to dist"
find -type f \
     '(' -name "*.html" -o -name "*.css" ')' \
     -a -not -path "./dist/*" \
     -exec cp --parents '{}' ./dist ';'
