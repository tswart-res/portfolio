#!/usr/bin/env bash
# new-project.sh — Scaffold a new MDX project file interactively.
#
# Usage: bash scripts/new-project.sh
#
# Creates:
#   src/content/projects/<slug>.mdx   — MDX file with pre-filled frontmatter
#   public/media/projects/<slug>/     — Media directory for this project

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_DIR="$REPO_ROOT/src/content/projects"
MEDIA_DIR="$REPO_ROOT/public/media/projects"

# ── Prompt for project details ────────────────────────────────────────────────
echo ""
echo "=== New Project Scaffold ==="
echo ""

read -r -p "Project title: " TITLE
if [[ -z "$TITLE" ]]; then
  echo "Error: title is required." >&2
  exit 1
fi

# Auto-generate slug from title (lowercase, spaces→hyphens, remove special chars)
SLUG_DEFAULT=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 -]//g; s/ \+/-/g; s/-\+/-/g; s/^-//; s/-$//')
read -r -p "Slug [$SLUG_DEFAULT]: " SLUG
SLUG="${SLUG:-$SLUG_DEFAULT}"

read -r -p "Description (1-2 sentences): " DESCRIPTION
read -r -p "Date [$(date +%Y-%m-%d)]: " DATE
DATE="${DATE:-$(date +%Y-%m-%d)}"
read -r -p "Tags (comma-separated, e.g. Docker,TypeScript): " TAGS_RAW
read -r -p "Repo URL (optional): " REPO_URL
read -r -p "Live URL (optional): " LIVE_URL
read -r -p "Has video demo? [y/N]: " HAS_VIDEO
read -r -p "Featured? [y/N]: " FEATURED

# ── Format tags as YAML list ──────────────────────────────────────────────────
IFS=',' read -ra TAG_ARRAY <<< "$TAGS_RAW"
TAGS_YAML=""
for tag in "${TAG_ARRAY[@]}"; do
  tag=$(echo "$tag" | xargs)   # trim whitespace
  [[ -n "$tag" ]] && TAGS_YAML="$TAGS_YAML\"$tag\", "
done
TAGS_YAML="[${TAGS_YAML%, }]"

# ── Build optional fields ─────────────────────────────────────────────────────
REPO_LINE=""
[[ -n "$REPO_URL" ]] && REPO_LINE="repoUrl: \"$REPO_URL\""
LIVE_LINE=""
[[ -n "$LIVE_URL" ]] && LIVE_LINE="liveUrl: \"$LIVE_URL\""
VIDEO_LINE=""
[[ "$HAS_VIDEO" =~ ^[Yy]$ ]] && VIDEO_LINE="videoDemo: \"/media/projects/$SLUG/demo.mp4\""
FEATURED_VAL="false"
[[ "$FEATURED" =~ ^[Yy]$ ]] && FEATURED_VAL="true"

MDX_FILE="$CONTENT_DIR/$SLUG.mdx"

# ── Check for existing file ───────────────────────────────────────────────────
if [[ -f "$MDX_FILE" ]]; then
  read -r -p "File $MDX_FILE already exists. Overwrite? [y/N]: " OVERWRITE
  [[ ! "$OVERWRITE" =~ ^[Yy]$ ]] && echo "Aborted." && exit 0
fi

# ── Write MDX file ────────────────────────────────────────────────────────────
cat > "$MDX_FILE" << FRONTMATTER
---
title: "$TITLE"
slug: "$SLUG"
description: "$DESCRIPTION"
date: "$DATE"
tags: $TAGS_YAML
thumbnail: "/media/projects/$SLUG/thumbnail.jpg"
${VIDEO_LINE:+$VIDEO_LINE$'\n'}${REPO_LINE:+$REPO_LINE$'\n'}${LIVE_LINE:+$LIVE_LINE$'\n'}featured: $FEATURED_VAL
status: "completed"
---

## Overview

TODO: Describe the project.

## What I Built

- TODO

## Technical Choices

- TODO
FRONTMATTER

# ── Create media directory ────────────────────────────────────────────────────
mkdir -p "$MEDIA_DIR/$SLUG"

echo ""
echo "✓ Created $MDX_FILE"
echo "✓ Created media directory: $MEDIA_DIR/$SLUG/"
echo ""
echo "Next steps:"
echo "  1. Edit $MDX_FILE"
echo "  2. Add thumbnail: cp your-image.jpg $MEDIA_DIR/$SLUG/thumbnail.jpg"
[[ "$HAS_VIDEO" =~ ^[Yy]$ ]] && echo "  3. Add video:     cp your-video.mp4 $MEDIA_DIR/$SLUG/demo.mp4"
