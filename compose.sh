#!/bin/sh

DIR=$(dirname $1)
BASE=$(basename $1)
OUT="${DIR}/${BASE%.*}.html"

npx nodemon --exec "tw < \"$1\" > \"$OUT\"" --watch "$1"
