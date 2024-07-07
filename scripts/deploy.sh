#!/bin/bash
set -euo pipefail

CONFIG_DIR=${1:-"production"}
EXPORT_DIR="out"
RSYNC_PATH=${2:-"example.com:~/art.example.com"}

pushd $(dirname $0)/..

# Remove old build
rm -rf "${EXPORT_DIR}/"
rm -rf next.config.js

# Copy the env file
cp "${CONFIG_DIR}/.env.local" .env.local

# Remove any old images and thumbnails
rm -rf "${EXPORT_DIR}/image"
rm -rf "${EXPORT_DIR}/thumbnail"
# Download the images and thumbnails
./scripts/download-images
./scripts/download-pages

# Build the site
yarn build
yarn export

# Copy scripts for cron job
cp scripts/download-pages "${EXPORT_DIR}"
cp scripts/download-images "${EXPORT_DIR}"
cp scripts/update-access-control "${EXPORT_DIR}"

# Push to muse-amuse.in
rsync -azP "${EXPORT_DIR}/" "${RSYNC_PATH}"

popd
