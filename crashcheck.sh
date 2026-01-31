#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:8080}"

# Provide a valid token in env:
#   TOKEN="..." ./crashcheck.sh
TOKEN="${TOKEN:-}"

# Optional: credentials for login to auto-fetch token if TOKEN is empty
LOGIN_EMAIL="${LOGIN_EMAIL:-}"
LOGIN_PASSWORD="${LOGIN_PASSWORD:-}"

# For endpoints needing an existing username to test "already exists" paths
DUP_EMAIL="${DUP_EMAIL:-dup@test.com}"
DUP_USER="${DUP_USER:-dupuser}"
DUP_PASS="${DUP_PASS:-pass123}"

# A username that should not exist
NOUSER="${NOUSER:-__definitely_not_a_user__}"

RED() { printf "\033[31m%s\033[0m\n" "$*"; }
GRN() { printf "\033[32m%s\033[0m\n" "$*"; }
YLW() { printf "\033[33m%s\033[0m\n" "$*"; }

# ---- helpers ----
req() {
  # usage: req "NAME" curl_args...
  local name="$1"; shift
  local tmp_body
  tmp_body="$(mktemp)"
  local code
  code="$(curl -sS -o "$tmp_body" -w "%{http_code}" "$@" || echo "000")"

  # expect ONLY 200/201 (your policy). If you truly want only 200, remove 201 below.
  if [[ "$code" == "200" || "$code" == "201" ]]; then
    GRN "PASS [$code] $name"
  else
    local snippet
    snippet="$(tr '\n' ' ' < "$tmp_body" | head -c 240)"
    RED "FAIL [$code] $name :: $snippet"
  fi
  rm -f "$tmp_body"
}

json() {
  # prints compact json safely from a string (or raw if jq missing)
  if command -v jq >/dev/null 2>&1; then
    echo "$1" | jq -c . 2>/dev/null || echo "$1"
  else
    echo "$1"
  fi
}

get_token_if_missing() {
  if [[ -n "$TOKEN" ]]; then return 0; fi
  if [[ -z "$LOGIN_EMAIL" || -z "$LOGIN_PASSWORD" ]]; then
    YLW "TOKEN is empty. Set TOKEN=... to test authenticated cases fully."
    YLW "Optionally set LOGIN_EMAIL and LOGIN_PASSWORD to auto-login."
    return 0
  fi

  YLW "Fetching token using /api/auth/login ..."
  local body
  body="$(curl -sS -X POST "$API_BASE/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "$(json "{\"email\":\"$LOGIN_EMAIL\",\"password\":\"$LOGIN_PASSWORD\"}")" \
    || true)"

  if command -v jq >/dev/null 2>&1; then
    TOKEN="$(echo "$body" | jq -r '.token // empty' 2>/dev/null || true)"
  else
    # naive fallback
    TOKEN="$(echo "$body" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p' | head -n1)"
  fi

  if [[ -n "$TOKEN" ]]; then
    GRN "Got TOKEN from login."
  else
    RED "Could not get token from login response: $(echo "$body" | head -c 200)"
  fi
}

auth_header() {
  if [[ -n "$TOKEN" ]]; then
    echo "Authorization: Bearer $TOKEN"
  else
    echo ""
  fi
}

# ---- create temp files for upload tests ----
TMP_TXT="$(mktemp)"
printf "hello" > "$TMP_TXT"

TMP_BIG="$(mktemp)"
# ~3MB file (bigger than 2MB limit)
dd if=/dev/zero of="$TMP_BIG" bs=1024 count=3000 >/dev/null 2>&1 || true

cleanup() {
  rm -f "$TMP_TXT" "$TMP_BIG"
}
trap cleanup EXIT

echo "API_BASE=$API_BASE"

# --------------------------------------------------------------------
# AUTH: SIGNUP
# --------------------------------------------------------------------
echo "=== AUTH /signup ==="
req "signup no body" \
  -X POST "$API_BASE/api/auth/signup"

req "signup empty json" \
  -X POST "$API_BASE/api/auth/signup" -H "Content-Type: application/json" -d '{}'

req "signup null fields" \
  -X POST "$API_BASE/api/auth/signup" -H "Content-Type: application/json" \
  -d '{"email":null,"username":null,"password":null}'

req "signup wrong types" \
  -X POST "$API_BASE/api/auth/signup" -H "Content-Type: application/json" \
  -d '{"email":123,"username":456,"password":789}'

req "signup invalid email format" \
  -X POST "$API_BASE/api/auth/signup" -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","username":"u1","password":"pass123"}'

# Duplicate test: run twice
req "signup create dup user (first time)" \
  -X POST "$API_BASE/api/auth/signup" -H "Content-Type: application/json" \
  -d "$(json "{\"email\":\"$DUP_EMAIL\",\"username\":\"$DUP_USER\",\"password\":\"$DUP_PASS\"}")"

req "signup create dup user (second time should not 4xx/5xx)" \
  -X POST "$API_BASE/api/auth/signup" -H "Content-Type: application/json" \
  -d "$(json "{\"email\":\"$DUP_EMAIL\",\"username\":\"$DUP_USER\",\"password\":\"$DUP_PASS\"}")"

# --------------------------------------------------------------------
# AUTH: LOGIN
# --------------------------------------------------------------------
echo "=== AUTH /login ==="
req "login no body" \
  -X POST "$API_BASE/api/auth/login"

req "login empty json" \
  -X POST "$API_BASE/api/auth/login" -H "Content-Type: application/json" -d '{}'

req "login wrong types" \
  -X POST "$API_BASE/api/auth/login" -H "Content-Type: application/json" \
  -d '{"email":123,"password":456}'

# Optional: attempt login with provided env credentials
if [[ -n "$LOGIN_EMAIL" && -n "$LOGIN_PASSWORD" ]]; then
  req "login valid credentials" \
    -X POST "$API_BASE/api/auth/login" -H "Content-Type: application/json" \
    -d "$(json "{\"email\":\"$LOGIN_EMAIL\",\"password\":\"$LOGIN_PASSWORD\"}")"
fi

get_token_if_missing

# --------------------------------------------------------------------
# ME
# --------------------------------------------------------------------
echo "=== ME /api/me ==="
req "me no token" \
  "$API_BASE/api/me"

req "me bad token" \
  "$API_BASE/api/me" -H "Authorization: Bearer bad.token.value"

if [[ -n "$TOKEN" ]]; then
  req "me valid token" \
    "$API_BASE/api/me" -H "$(auth_header)"
else
  YLW "Skipping me valid-token test (no TOKEN)."
fi

# --------------------------------------------------------------------
# SETTINGS: PATCH /api/me/profile
# --------------------------------------------------------------------
echo "=== SETTINGS /api/me/profile ==="
req "settings no token" \
  -X PATCH "$API_BASE/api/me/profile" -H "Content-Type: application/json" \
  -d '{"age":20,"location":"Dubai"}'

if [[ -n "$TOKEN" ]]; then
  req "settings valid token good body" \
    -X PATCH "$API_BASE/api/me/profile" -H "$(auth_header)" -H "Content-Type: application/json" \
    -d '{"age":20,"location":"Dubai"}'

  req "settings valid token empty body (no body)" \
    -X PATCH "$API_BASE/api/me/profile" -H "$(auth_header)"

  req "settings valid token empty json {}" \
    -X PATCH "$API_BASE/api/me/profile" -H "$(auth_header)" -H "Content-Type: application/json" \
    -d '{}'

  req "settings invalid age string" \
    -X PATCH "$API_BASE/api/me/profile" -H "$(auth_header)" -H "Content-Type: application/json" \
    -d '{"age":"abc","location":"Dubai"}'

  # very long location
  LONG="$(python3 - <<'PY'
print("x"*5000)
PY
)"
  req "settings location too long" \
    -X PATCH "$API_BASE/api/me/profile" -H "$(auth_header)" -H "Content-Type: application/json" \
    -d "{\"location\":\"$LONG\"}"
else
  YLW "Skipping settings authenticated tests (no TOKEN)."
fi

# --------------------------------------------------------------------
# FRIENDS
# --------------------------------------------------------------------
echo "=== FRIENDS ==="
req "friends list no token" \
  "$API_BASE/api/friends"

req "friends incoming no token" \
  "$API_BASE/api/friends/incoming"

if [[ -n "$TOKEN" ]]; then
  req "friends request missing json" \
    -X POST "$API_BASE/api/friends/request" -H "$(auth_header)"

  req "friends request empty {}" \
    -X POST "$API_BASE/api/friends/request" -H "$(auth_header)" -H "Content-Type: application/json" -d '{}'

  req "friends request wrong type username" \
    -X POST "$API_BASE/api/friends/request" -H "$(auth_header)" -H "Content-Type: application/json" \
    -d '{"username":123}'

  req "friends request non-existing user" \
    -X POST "$API_BASE/api/friends/request" -H "$(auth_header)" -H "Content-Type: application/json" \
    -d "$(json "{\"username\":\"$NOUSER\"}")"

  req "friends accept invalid id" \
    -X POST "$API_BASE/api/friends/accept/not-a-number" -H "$(auth_header)"

  req "friends accept non-existing id" \
    -X POST "$API_BASE/api/friends/accept/999999" -H "$(auth_header)"

  req "friends delete invalid id" \
    -X DELETE "$API_BASE/api/friends/not-a-number" -H "$(auth_header)"

  req "friends delete random id" \
    -X DELETE "$API_BASE/api/friends/999999" -H "$(auth_header)"

  req "friends list valid token" \
    "$API_BASE/api/friends" -H "$(auth_header)"

  req "friends incoming valid token" \
    "$API_BASE/api/friends/incoming" -H "$(auth_header)"
else
  YLW "Skipping friends authenticated tests (no TOKEN)."
fi

# --------------------------------------------------------------------
# PRESENCE (HTTP)
# --------------------------------------------------------------------
echo "=== PRESENCE (HTTP) ==="
req "presence online no token" \
  "$API_BASE/api/presence/online"

req "presence status invalid id no token" \
  "$API_BASE/api/presence/status/abc"

if [[ -n "$TOKEN" ]]; then
  req "presence online valid token" \
    "$API_BASE/api/presence/online" -H "$(auth_header)"

  req "presence status invalid id valid token" \
    "$API_BASE/api/presence/status/abc" -H "$(auth_header)"

  req "presence status valid id" \
    "$API_BASE/api/presence/status/1" -H "$(auth_header)"
else
  YLW "Skipping presence authenticated tests (no TOKEN)."
fi

# --------------------------------------------------------------------
# AVATAR
# --------------------------------------------------------------------
echo "=== AVATAR /api/me/avatar ==="
req "avatar no token" \
  -X POST "$API_BASE/api/me/avatar"

if [[ -n "$TOKEN" ]]; then
  # Wrong content-type
  req "avatar wrong content-type json" \
    -X POST "$API_BASE/api/me/avatar" -H "$(auth_header)" -H "Content-Type: application/json" -d '{}'

  # Multipart but missing avatar field
  req "avatar multipart missing file" \
    -X POST "$API_BASE/api/me/avatar" -H "$(auth_header)" \
    -F "nothing=1"

  # Wrong field name
  req "avatar wrong field name" \
    -X POST "$API_BASE/api/me/avatar" -H "$(auth_header)" \
    -F "notavatar=@$TMP_TXT;type=text/plain"

  # Unsupported type (depends on your AvatarService)
  req "avatar unsupported type text/plain" \
    -X POST "$API_BASE/api/me/avatar" -H "$(auth_header)" \
    -F "avatar=@$TMP_TXT;type=text/plain"

  # Too large (>2MB). If nginx returns 413, you must raise/align nginx limit.
  req "avatar too large" \
    -X POST "$API_BASE/api/me/avatar" -H "$(auth_header)" \
    -F "avatar=@$TMP_BIG;type=application/octet-stream"
else
  YLW "Skipping avatar authenticated tests (no TOKEN)."
fi

# --------------------------------------------------------------------
# PRESENCE WS (optional)
# --------------------------------------------------------------------
echo "=== PRESENCE WS (optional) ==="
if command -v wscat >/dev/null 2>&1; then
  YLW "wscat detected: testing WS handshake (this prints output)."
  echo "-> ws no token (should close quickly)"
  wscat -c "ws://localhost:8080/ws/presence" -w 1 >/dev/null 2>&1 || true

  echo "-> ws bad token (should close quickly)"
  wscat -c "ws://localhost:8080/ws/presence?token=bad" -w 1 >/dev/null 2>&1 || true

  if [[ -n "$TOKEN" ]]; then
    echo "-> ws valid token (should receive hello)"
    wscat -c "ws://localhost:8080/ws/presence?token=$TOKEN" -w 1 >/dev/null 2>&1 || true
  else
    YLW "Skipping ws valid-token test (no TOKEN)."
  fi
else
  YLW "wscat not installed; skipping WS tests. Install: npm i -g wscat"
fi

echo
GRN "DONE. Any FAIL lines above mean you still have a non-200/201 response or a crash path."
