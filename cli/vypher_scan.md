## vypher scan

Scan a directory for PII/PHI

### Synopsis

Scan a directory recursively for files containing PII (Personally Identifiable Information)
or PHI (Protected Health Information).

File scanning is parallelized across all available CPU cores for maximum throughput.
Configuration can be loaded from a YAML file with `--config`. CLI flags override config file values.

### Usage

```
vypher scan [flags]
```

### Options

```
  -e, --exclude strings   Glob patterns to exclude (e.g. "*_test.go")
      --fail-on-match     Exit with code 1 if any issues are found (for CI/CD)
  -h, --help              help for scan
      --max-depth int     Maximum directory recursion depth (0 = unlimited)
  -o, --output string     Output format (console, json, sarif) (default "console")
      --rules strings     Rule tags to enable (e.g. "finance,phi")
  -t, --target string     Directory to scan (defaults to current directory)
```

### Options inherited from parent commands

```
  -c, --config string   config file (e.g. .vypher.yaml)
```

### Examples

```bash
# Scan the current directory
vypher scan

# Scan a specific directory
vypher scan --target ./src

# JSON output
vypher scan -t ./src -o json

# SARIF output (for GitHub Code Scanning, VS Code)
vypher scan -t ./src -o sarif

# Exclude files matching glob patterns
vypher scan -t ./src --exclude "*_test.go" --exclude "*.log"

# Run only finance and healthcare rules
vypher scan -t ./src --rules finance,phi

# Limit recursion depth
vypher scan -t ./src --max-depth 3

# Use a config file
vypher scan --config .vypher.yaml

# CI/CD: fail the build on any finding
vypher scan -t ./src --rules finance,healthcare -o sarif --fail-on-match
```

### Console Output

Findings are printed with the file path and **line number** for each match. Sensitive values are masked, showing only the first and last two characters:

```
Scan Complete.
Scanned 2 files with findings.
Total Issues found: 4

File: /path/to/src/users.go
  - [Email] jo****om (Line: 42)
  - [SSN] 12****89 (Line: 87)

File: /path/to/src/payments.go
  - [Credit Card] 41****11 (Line: 14)
  - [Bitcoin Address] 1A****Na (Line: 201)
```

### Default Ignored Directories

The following directories are always skipped regardless of `--exclude`:

| Directory | Reason |
|-----------|--------|
| `.git` | Version control internals |
| `node_modules` | Third-party JS packages |
| `vendor` | Go/PHP vendored dependencies |
| `.venv` | Python virtual environments |
| `__pycache__` | Python bytecode cache |
| `dist` | Build output |
| `build` | Build output |
| `.next` | Next.js build output |
| `.nuxt` | Nuxt.js build output |
| `out` | Build output |

### Default Ignored Files

The following files are always skipped to prevent false positives from checksums, integrity hashes, and other generated content:

| File | Reason |
|------|--------|
| `package-lock.json` | npm integrity hashes |
| `yarn.lock` | Yarn checksums |
| `pnpm-lock.yaml` | pnpm checksums |
| `bun.lockb` | Bun lockfile |
| `go.sum` | Go module checksums |
| `Cargo.lock` | Rust checksums |
| `composer.lock` | PHP checksums |
| `Gemfile.lock` | Ruby checksums |
| `poetry.lock` | Python checksums |
| `*.lock` | Any other lockfile |

### Detection Patterns

Vypher ships with 11 built-in detection patterns:

| Pattern | Description | Tags | Validation |
|---------|-------------|------|------------|
| Credit Card | 13-16 digit card numbers | `finance`, `pii` | Luhn algorithm + keyword proximity |
| SSN | US Social Security Numbers (XXX-XX-XXXX) | `finance`, `pii`, `government` | Keyword proximity |
| Email | Email addresses | `pii`, `communication` | — |
| Phone | US/International phone numbers | `pii`, `communication` | — |
| IBAN | International Bank Account Numbers | `finance` | — |
| MRN | Medical Record Numbers (6-12 digits, prefixed) | `healthcare`, `phi` | — |
| DOB | Date of Birth near keywords | `pii`, `phi` | — |
| ICD-10 | ICD-10 medical diagnosis codes | `healthcare`, `phi` | — |
| Bitcoin | P2PKH, P2SH, Bech32 wallet addresses | `finance`, `crypto` | Keyword proximity |
| Ethereum | 0x-prefixed 40 hex char addresses | `finance`, `crypto` | Keyword proximity |
| Solana | Base58 32-44 char wallet addresses | `finance`, `crypto` | Keyword proximity |

#### Credit Card Validation

All credit card regex matches are validated with the **Luhn algorithm** before being reported, eliminating the most common source of false positives for numeric sequences.

#### Keyword Proximity

Some rules (Credit Card, SSN, Bitcoin, Ethereum, Solana) check for relevant keywords within ±50 characters of the match (e.g. `"visa"`, `"ssn"`, `"wallet"`). When a keyword is found nearby, the match is flagged as high-confidence (`KeywordProximity: true` in JSON/SARIF output).

### Rule Tags

Use `--rules` to limit scanning to specific categories:

| Tag | Patterns Included |
|-----|-------------------|
| `finance` | Credit Card, SSN, IBAN, Bitcoin, Ethereum, Solana |
| `crypto` | Bitcoin, Ethereum, Solana |
| `pii` | Credit Card, SSN, Email, Phone, DOB |
| `healthcare` | MRN, ICD-10 |
| `phi` | MRN, DOB, ICD-10 |
| `communication` | Email, Phone |
| `government` | SSN |

```bash
# Finance patterns only
vypher scan -t ./src --rules finance

# Crypto wallet addresses only
vypher scan -t ./src --rules crypto

# Healthcare compliance (MRN, ICD-10, DOB)
vypher scan -t ./src --rules healthcare,phi

# General PII
vypher scan -t ./src --rules pii
```

### Excluding Files and Directories

Use `--exclude` with glob patterns. Patterns are matched against both file names and relative paths:

```bash
# Exclude test files and logs
vypher scan -t ./src --exclude "*_test.go" --exclude "*.log"

# Exclude a specific subdirectory
vypher scan -t . --exclude "fixtures/**"

# Multiple patterns via config file
# .vypher.yaml:
# exclude:
#   - "*_test.go"
#   - "testdata/**"
#   - "*.generated.go"
```

### CI/CD Integration

`--fail-on-match` causes Vypher to exit with code `1` if any findings are detected, making it easy to block merges or deployments:

```bash
# GitHub Actions example
vypher scan -t ./src -o sarif --fail-on-match > results.sarif
```

SARIF output can be uploaded directly to GitHub Code Scanning for inline PR annotations.

### SEE ALSO

* [vypher](vypher.md) - Vypher is a PII and PHI scanning tool
