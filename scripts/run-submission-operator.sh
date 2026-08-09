#!/bin/bash

# Vercel's environment runner supplies every Production variable to this
# process. Reduce that environment before Node or any JavaScript dependency
# starts. The moderation client needs only its independent operator secret.
set +x
set -euo pipefail

declare vr_operator_secret="${SUBMISSION_OPERATOR_SECRET-}"
declare vr_ci="${CI-}"
if [ "${#vr_operator_secret}" -lt 24 ]; then
  echo "SUBMISSION_OPERATOR_SECRET is not configured for Production." >&2
  exit 1
fi

declare vr_node_binary
vr_node_binary=$(builtin type -P node 2>/dev/null || true)
case "$vr_node_binary" in
  /*) ;;
  *)
    echo "A Node.js executable was not found." >&2
    exit 1
    ;;
esac

declare vr_script_directory="${0%/*}"
if [ "$vr_script_directory" = "$0" ]; then
  vr_script_directory=.
fi
declare vr_project_directory
vr_project_directory=$(CDPATH= cd "$vr_script_directory/.." && pwd -P)
declare vr_tsx_cli="$vr_project_directory/node_modules/tsx/dist/cli.mjs"
declare vr_operator_cli="$vr_project_directory/scripts/moderate-submissions.ts"
declare vr_safe_path="${vr_node_binary%/*}:/usr/bin:/bin"

if [ ! -f "$vr_tsx_cli" ] || [ ! -f "$vr_operator_cli" ]; then
  echo "Install the reviewed project dependencies before moderation." >&2
  exit 1
fi

# Keep captured values as unexported shell variables while every inherited
# environment name is removed. `compgen`, `unset`, and `export` are Bash
# builtins, so the operator secret never appears in an intermediate argv.
export -n \
  vr_operator_secret \
  vr_ci \
  vr_node_binary \
  vr_script_directory \
  vr_project_directory \
  vr_tsx_cli \
  vr_operator_cli \
  vr_safe_path 2>/dev/null || true
declare vr_environment_name=""
export -n vr_environment_name 2>/dev/null || true
for vr_environment_name in $(compgen -e); do
  unset "$vr_environment_name" 2>/dev/null || true
done

export PATH="$vr_safe_path"
export CI="$vr_ci"
export NODE_ENV=production
export SUBMISSION_OPERATOR_SECRET="$vr_operator_secret"
unset vr_operator_secret

exec "$vr_node_binary" "$vr_tsx_cli" "$vr_operator_cli" "$@"
