$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
node (Join-Path $root "tools\validate_public_evidence.js")
node (Join-Path $root "tools\render_summary.js")
