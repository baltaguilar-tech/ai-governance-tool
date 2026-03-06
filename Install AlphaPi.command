#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# AlphaPi Beta — macOS Installer
# Double-click this file from the mounted disk image to install AlphaPi.
# ─────────────────────────────────────────────────────────────────────────────

APP_NAME="AlphaPi.app"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$SCRIPT_DIR/$APP_NAME"
DEST="/Applications/$APP_NAME"

echo ""
echo "AlphaPi Beta Installer"
echo "──────────────────────"

# 1. Verify the app is present in the same folder as this script
if [ ! -d "$SOURCE" ]; then
  echo ""
  echo "ERROR: $APP_NAME not found next to this installer."
  echo "Make sure you are running this script from inside the AlphaPi disk image."
  echo ""
  read -n 1 -s -r -p "Press any key to close..."
  exit 1
fi

# 2. Remove macOS quarantine flag from the app (bypasses Gatekeeper for unsigned builds)
echo ""
echo "Removing macOS security restriction from AlphaPi..."
xattr -cr "$SOURCE" 2>/dev/null

# 3. Copy to /Applications (overwrite if previous beta exists)
echo "Installing AlphaPi to /Applications..."
if [ -d "$DEST" ]; then
  echo "(Replacing existing installation)"
  rm -rf "$DEST"
fi
cp -R "$SOURCE" "$DEST"

# 4. Remove quarantine from installed location (belt-and-suspenders)
xattr -cr "$DEST" 2>/dev/null

# 5. Launch the app
echo "Launching AlphaPi..."
open "$DEST"

echo ""
echo "Done! AlphaPi is now in your Applications folder."
echo "You can eject the disk image and delete the .dmg file."
echo ""
read -n 1 -s -r -p "Press any key to close this window..."
