#!/usr/bin/env bash
# Netora Play Store screenshot capture helper.
# Connect an Android device with USB debugging on, open Netora, then run:
#   bash store-assets/capture-screenshots.sh
# Navigate to each screen in the app when prompted and press Enter.
# PNG files are saved to store-assets/screenshots/<name>.png (1080x1920).
set -euo pipefail

OUT="$(cd "$(dirname "$0")/screenshots" && pwd)"
mkdir -p "$OUT"

if ! command -v adb >/dev/null 2>&1; then
  echo "ERROR: 'adb' not found on PATH. Install Android platform-tools first." >&2
  exit 1
fi
if ! adb devices | grep -qE "device$"; then
  echo "ERROR: No Android device connected. Enable USB debugging and connect." >&2
  exit 1
fi

capture() {
  local name="$1"
  adb exec-out screencap -p > "$OUT/$name.png"
  echo "Saved $OUT/$name.png"
}

echo "Make sure Netora is open on the device and your phone is in the screen you want."
echo "Screens to capture (recommended order):"
echo "  1. speedtest   - Home screen with a completed speed test (start, run test, wait for result)"
echo "  2. analytics   - 'View full analytics' from the Home screen after a test"
echo "  3. servers     - Servers screen (server list / map)"
echo "  4. history     - History screen with a few past tests"
echo "  5. settings    - Settings screen"
echo

capture_screen() {
  local name="$1"
  local hint="$2"
  read -r -p "Navigate to: $hint. Press Enter to capture '$name'... " _
  capture "$name"
}

capture_screen speedtest "Home with a completed speed test result"
capture_screen analytics "Analytics screen (full test breakdown)"
capture_screen servers "Servers screen (list or map)"
capture_screen history "History screen"
capture_screen settings "Settings screen"

echo
echo "Done. Files in $OUT"
echo "Review them, then upload as Phone screenshots in Play Console (order: speedtest, analytics, servers, history, settings)."
