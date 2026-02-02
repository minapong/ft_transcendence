#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-ws://localhost:8080/ws/presence}"
TOKEN="${TOKEN:-}"

echo "BASE=$BASE"

run() {
  local name="$1"
  local url="$2"
  echo "=== $name ==="
  # -w 1 closes after 1s
  # print output so you can see close codes/reasons
  npx --yes wscat -c "$url" -w 1 || true
  echo
}

run "missing token" "$BASE"
run "token empty" "$BASE?token="
run "token bad" "$BASE?token=bad"
run "token whitespace" "$BASE?token=%20%20%20"
run "token plus" "$BASE?token=+++"
run "token urlencoded junk" "$BASE?token=%FF%FE%FD"
run "token with quotes" "$BASE?token=%22bad%22"
run "token with unicode" "$BASE?token=%E2%98%A0"
run "token with very long (5k)" "$BASE?token=$(python3 - <<'PY'
print("a"*5000)
PY
)"

if [[ -n "$TOKEN" ]]; then
  run "valid token" "$BASE?token=$TOKEN"
  run "valid token + extra param" "$BASE?token=$TOKEN&x=y"
  run "valid token param duplicated" "$BASE?token=$TOKEN&token=bad"
  run "valid token encoded" "$BASE?token=$(python3 - <<'PY'
import urllib.parse, os
print(urllib.parse.quote(os.environ["TOKEN"]))
PY
)"
else
  echo "TOKEN not set, skipping valid-token cases."
fi
