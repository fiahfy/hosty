#!/bin/bash

SIZES="16 32 128 256"
ORG_SIZE="512"
ORG_FILE="icon_${ORG_SIZE}x${ORG_SIZE}.png"

cd $(dirname $0)
cd ../static/hosty.iconset

for SIZE in $SIZES
do
  FILE="icon_${SIZE}x${SIZE}.png"
  sips -Z ${SIZE} ${ORG_FILE} --out ${FILE}
  echo "${FILE} is created"
done

cd ..

iconutil -c icns hosty.iconset
echo "icns file is created"
