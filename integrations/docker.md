# Docker

Vypher is available as a Docker image, requiring no local installation. Mount the directory you want to scan as a volume and pass scan flags as arguments.

```bash
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan
```

## Common Examples

```bash
# Scan the current directory (console output)
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan

# Finance and healthcare patterns only
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan --rules finance,healthcare,phi

# JSON output
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan --output json

# SARIF output written to a local file
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan --output sarif > results.sarif

# Fail with exit code 1 on any finding (CI/CD)
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan --fail-on-match

# Using a config file
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan --config /scan/.vypher.yaml
```

## Pinning a Version

```bash
# Latest
docker pull pseudocoding/vypher:latest

# Specific version
docker pull pseudocoding/vypher:0.0.6

# In CI, prefer pinning to a specific version for reproducibility
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher:0.0.6 scan --target /scan --fail-on-match
```

## GitHub Actions with Docker

You can use the Docker image directly in GitHub Actions without any installation step:

```yaml
name: PII/PHI Scan

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Scan for PII/PHI
        run: |
          docker run --rm -v "${{ github.workspace }}":/scan \
            pseudocoding/vypher scan --target /scan --fail-on-match
```
