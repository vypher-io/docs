# Integrations

## Docker

Vypher is available as a Docker image, requiring no local installation. Mount the directory you want to scan as a volume and pass scan flags as arguments.

```bash
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan
```

### Common Examples

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

### Pinning a Version

```bash
# Latest
docker pull pseudocoding/vypher:latest

# Specific version
docker pull pseudocoding/vypher:0.0.4

# In CI, prefer pinning to a specific version for reproducibility
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher:0.0.4 scan --target /scan --fail-on-match
```

### GitHub Actions with Docker

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

---

## GitHub Actions

Vypher can be added to any CI/CD pipeline to automatically scan for PII/PHI on every push or pull request. Using `--fail-on-match` causes the workflow to fail if any findings are detected, blocking merges until they are resolved.

### Basic Scan on Pull Request

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

### SARIF Upload to GitHub Code Scanning

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

### Scoped Scan by Rule Tag

```yaml
      - name: Scan for finance and healthcare data only
        run: vypher scan --target ./src --rules finance,healthcare,phi --fail-on-match
```

### Using a Config File

If you have a `.vypher.yaml` in your repo, the workflow will pick it up automatically:

```yaml
      - name: Scan with project config
        run: vypher scan --config .vypher.yaml --fail-on-match
```

---

## Git Hooks

A pre-commit hook runs Vypher locally before every commit, preventing sensitive data from ever entering the repository.

### Setup

Create the hook file at `.git/hooks/pre-commit`:

```bash
#!/bin/sh
# Vypher pre-commit hook
# Scans staged files for PII/PHI and blocks the commit if findings are detected.

if ! command -v vypher > /dev/null 2>&1; then
  echo "vypher: command not found, skipping PII/PHI scan."
  echo "Install from https://docs.vypher.io/installation"
  exit 0
fi

# Write staged files to a temp directory and scan them
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

git diff --cached --name-only --diff-filter=ACM | while IFS= read -r file; do
  mkdir -p "$TMPDIR/$(dirname "$file")"
  git show ":$file" > "$TMPDIR/$file" 2>/dev/null
done

vypher scan --target "$TMPDIR" --fail-on-match

if [ $? -ne 0 ]; then
  echo ""
  echo "Commit blocked: PII/PHI detected in staged files."
  echo "Review the findings above and remove sensitive data before committing."
  exit 1
fi
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

### Sharing Hooks with Your Team

Git hooks are not committed with the repository by default. To share them, store the hook in a checked-in directory and configure Git to use it:

```bash
mkdir -p .githooks
cp .git/hooks/pre-commit .githooks/pre-commit
git config core.hooksPath .githooks
```

Teammates can then activate the hooks after cloning by running:

```bash
git config core.hooksPath .githooks
```

Or automate it with a project setup script:

```bash
#!/bin/sh
# scripts/setup.sh
git config core.hooksPath .githooks
echo "Git hooks configured."
```

### Using with pre-commit Framework

If your project uses the [pre-commit](https://pre-commit.com) framework, you can add Vypher as a local hook in `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: vypher
        name: Vypher PII/PHI Scan
        entry: vypher scan --target . --fail-on-match
        language: system
        pass_filenames: false
        stages: [pre-commit]
```
