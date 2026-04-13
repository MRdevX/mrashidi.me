#!/usr/bin/env bash
# CI auto-release for GitHub Actions: standard-version (no auto-tag) + explicit git tag.
#
# Orphan-tag policy (A — auto-repair): If refs/tags/vX.Y.Z exists but points at a commit
# other than the new release commit (common when a tag exists on GitHub but is not an
# ancestor of main), this script deletes the local tag, deletes it on origin when
# present, and recreates it on HEAD. For manual-only repair, remove that branch and fail
# with instructions instead.
#
# Requires: GITHUB_OUTPUT, run from repository root after checkout.

set -euo pipefail

BRANCH="${1:?usage: ci-auto-release.sh <branch>}"
: "${GITHUB_OUTPUT:?GITHUB_OUTPUT must be set}"

skip_release() {
  echo "should_release=false" >>"$GITHUB_OUTPUT"
}

export HUSKY=0

git fetch origin "$BRANCH" --tags

LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || true)
if [ -n "$LAST_TAG" ] && [ "$(git rev-list "$LAST_TAG..HEAD" --count)" -eq 0 ]; then
  skip_release
  exit 0
fi

OLD=$(node -p "require('./package.json').version")
# --skip.tag: fetched orphan vX.Y.Z is invisible to git describe but still blocks git tag -a.
pnpm release -- --skip.tag
NEW=$(node -p "require('./package.json').version")

if [ "$OLD" = "$NEW" ]; then
  skip_release
  exit 0
fi

TAG="v${NEW}"
HEAD_SHA=$(git rev-parse HEAD)

if git rev-parse "refs/tags/${TAG}" >/dev/null 2>&1; then
  TAG_SHA=$(git rev-parse "refs/tags/${TAG}^{}")
  if [ "${TAG_SHA}" = "${HEAD_SHA}" ]; then
    echo "Tag ${TAG} already points at this release commit."
  else
    echo "Replacing orphan tag ${TAG} (was ${TAG_SHA}, release commit ${HEAD_SHA})."
    git tag -d "${TAG}"
    if git ls-remote --tags origin "refs/tags/${TAG}" | grep -q .; then
      git push origin ":refs/tags/${TAG}"
    fi
    git tag -a "${TAG}" -m "chore(release): ${NEW}"
  fi
else
  git tag -a "${TAG}" -m "chore(release): ${NEW}"
fi

echo "version=${NEW}" >>"$GITHUB_OUTPUT"
echo "should_release=true" >>"$GITHUB_OUTPUT"
