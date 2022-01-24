#!/bin/bash
set -euo pipefail

EXPORT_DIR="out"

# Build the site
pushd $(dirname $0)/..
yarn build
yarn export

# Don't sync image/thumbnail dirs since we use CDN on production
rm -r "${EXPORT_DIR}/image"
rm -r "${EXPORT_DIR}/thumbnail"

# Push to muse-amuse.in
rsync -azP "${EXPORT_DIR}/" muse-amuse.in:~/artful-dodger.muse-amuse.in

popd
