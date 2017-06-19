#!/bin/bash

SIZE="540"
ORG_FILE="background@2x.png"
FILE="background.png"

cd $(dirname $0)
cd ../build

sips -Z ${SIZE} ${ORG_FILE} --out ${FILE}
echo "${FILE} is created"

TIFF_FILE="background.tiff"
tiffutil -cathidpicheck ${FILE} ${ORG_FILE} -out ${TIFF_FILE}
echo "${TIFF_FILE} is created"
