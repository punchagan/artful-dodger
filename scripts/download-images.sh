#!/bin/bash
set -euo pipefail

DOWNLOAD_DIR="public"

download_images () {
    PREFIX=$1
    DIR=$2

    rm -f /tmp/input.txt
    mkdir -p "${DIR}"

    pushd "${DIR}"

    # Figure out missing files
    for id in $(jq -r ".[].thumbnail"  /tmp/metadata.json);
    do
        if [ ! -f "${id}" ]; then
            echo "${PREFIX}${id}" >> /tmp/input.txt
        fi
    done

    # Download images
    wget -c -i /tmp/input.txt

    # Rename files
    for file in $(ls);
    do
        out=$(echo "${file}" | sed -e 's/.*id=//g')
        if [ $out != $file ];
           then
               mv $file $out
        fi
    done

    echo "Success"

    popd
}

# Fetch JSON using env
pushd $(dirname $0)/..
source .env.local
download_images "https://drive.google.com/thumbnail?id=" "${DOWNLOAD_DIR}/thumbnail/"
download_images "https://drive.google.com/uc?export=view&id=" "${DOWNLOAD_DIR}/image/"
popd
