#!/bin/sh -eu
if [ -z "${API:-}" ]; then
    API_URL_JSON=undefined
else
    API_URL_JSON=$(jq -n --arg api '$API' '$api')
fi
 
cat <<EOF
window.REACT_APP_API=$API_URL_JSON;
EOF