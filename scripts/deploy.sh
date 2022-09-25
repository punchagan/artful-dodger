#!/bin/bash
set -euo pipefail

EXPORT_DIR="out"

pushd $(dirname $0)/..

# Remove old build
rm -rf "${EXPORT_DIR}/"
rm -rf next.config.js

# Copy the env file
cp production/.env.local.artful-dodger.muse-amuse.in .env.local
# Download the pages
./scripts/download-pages

# Build the site
yarn build
yarn export

# Don't sync image/thumbnail dirs since we use CDN on production
rm -r "${EXPORT_DIR}/image"
rm -r "${EXPORT_DIR}/thumbnail"

# Copy scripts for cron job
cp scripts/download-pages "${EXPORT_DIR}"
cp scripts/download-images "${EXPORT_DIR}"
cp scripts/update-access-control "${EXPORT_DIR}"

# Push to muse-amuse.in
rsync -azP "${EXPORT_DIR}/" muse-amuse.in:~/artful-dodger.muse-amuse.in

popd
