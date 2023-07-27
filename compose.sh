#!/bin/sh

DIR=$(dirname $1)
BASE=$(basename $1)
OUT="${DIR}/${BASE%.*}.html"

# Using local version of `tw` for now.
npx nodemon --exec "tw < \"$1\" > \"$OUT\"" --watch "$1"
