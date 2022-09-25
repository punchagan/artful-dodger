#!/bin/bash
set -euo pipefail

EXPORT_DIR="out"

pushd $(dirname $0)/..

# Remove old build
rm -rf "${EXPORT_DIR}/"

# Create next.config.js file
echo "module.exports = {
  basePath: '/artful-dodger',
}" > next.config.js

# Copy the env file
cp .env.local.default .env.local

# Setup pages
for page in about faq privacy terms return;
do
    cp README.md public/$page.md
done

# Build the site
yarn build
yarn export

# Don't sync image/thumbnail dirs since we use CDN on production
rm -r "${EXPORT_DIR}/image"
rm -r "${EXPORT_DIR}/thumbnail"

# Push to GitHub pages
GIT_URL=$(git remote get-url origin)
pushd "${EXPORT_DIR}"
git init
git add .
git commit -m "Deploy to GitHub Pages" || true
git push --force "${GIT_URL}" main:gh-pages
popd

# Delete next.config.s file
rm -rf next.config.js

popd
