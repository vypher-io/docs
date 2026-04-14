# GitHub Actions

Vypher can be added to any CI/CD pipeline to automatically scan for PII/PHI on every push or pull request. Using `--fail-on-match` causes the workflow to fail if any findings are detected, blocking merges until they are resolved.

## Basic Scan on Pull Request

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

      - name: Install Vypher
        run: |
          curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
          sudo mv vypher /usr/local/bin/vypher

      - name: Scan for PII/PHI
        run: vypher scan --target . --fail-on-match
```

## SARIF Upload to GitHub Code Scanning

SARIF output integrates directly with GitHub's Security tab, giving you inline annotations on pull requests.

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
    permissions:
      security-events: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Vypher
        run: |
          curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
          sudo mv vypher /usr/local/bin/vypher

      - name: Scan for PII/PHI
        run: vypher scan --target . --output sarif --fail-on-match > results.sarif
        continue-on-error: true

      - name: Upload SARIF to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
```

> `continue-on-error: true` on the scan step ensures the SARIF file is always uploaded even when findings are detected, so annotations appear in the PR regardless of exit code.

## Scoped Scan by Rule Tag

```yaml
      - name: Scan for finance and healthcare data only
        run: vypher scan --target ./src --rules finance,healthcare,phi --fail-on-match
```

## Using a Config File

If you have a `.vypher.yaml` in your repo, the workflow will pick it up automatically:

```yaml
      - name: Scan with project config
        run: vypher scan --config .vypher.yaml --fail-on-match
```

## Using Docker Instead

Prefer running without an install step? See the [Docker integration](./docker#github-actions-with-docker).
