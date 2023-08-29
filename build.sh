#!/bin/sh

find -type f \
     -path "./root/*" \
     -name "*.txt" \
     -exec ./single-compose.sh '{}' ';'
