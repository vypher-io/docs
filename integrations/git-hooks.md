# Git Hooks

A pre-commit hook runs Vypher locally before every commit, preventing sensitive data from ever entering the repository.

## Setup

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

## Sharing Hooks with Your Team

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

## Using with pre-commit Framework

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
