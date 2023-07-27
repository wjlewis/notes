#!/bin/sh

echo "Cleaning dist"
rm -rf dist
mkdir dist

echo "Copying notes into dist"
find -type f \
     '(' -name "*.html" -o -name "*.css" ')' \
     -a -not -path "./dist/*" \
     -exec cp --parents '{}' ./dist ';'

echo "Updating paths to main.css"
find -type f \
     -name "*.html" \
     -path "./dist/*" \
     -exec sed -i 's/href="\/main.css"/href="\/notes\/main.css"/' '{}' ';'

echo "Publishing to GitHub pages"
npx gh-pages@2.1.1 -d ./dist
