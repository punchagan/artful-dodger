#!/bin/bash
set -euo pipefail

EXPORT_DIR="out"

# Build the site
pushd $(dirname $0)/..
yarn build
yarn export

# Push to muse-amuse.in
rsync -azP "${EXPORT_DIR}/" muse-amuse.in:~/artful-dodger.muse-amuse.in

popd
