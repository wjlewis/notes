#!/bin/sh

echo "Cleaning dist"
rm -rf dist
mkdir dist

echo "Copying notes into dist"
cd root
find -type f \
     -path "./*" \
     -a -not -path "../dist/*" \
     -a -not -name "*.draft.html" \
     '(' -name "*.html" -o -name "*.css" ')' \
     -exec cp --parents '{}' ../dist ';'
cd ..

echo "Updating paths to main.css"
find -type f \
     -name "*.html" \
     -path "./dist/*" \
     -exec sed -i 's/href="\/main.css"/href="\/notes\/main.css"/' '{}' ';'

echo "Publishing to GitHub pages"
npx gh-pages@2.1.1 -d ./dist
