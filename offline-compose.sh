#!/bin/sh

DIR=$(dirname $1)
BASE=$(basename $1)
OUT="${DIR}/${BASE%.*}.html"

tw < "$1" > "$OUT"
