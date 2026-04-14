## vypher

Vypher is a PII and PHI scanning tool

### Synopsis

Vypher is a CLI tool designed to scan directories for Personally Identifiable Information (PII)
and Protected Health Information (PHI) with a focus on finance and healthcare data.

It helps developers and security professionals identify sensitive data leaks in their codebase or file systems.

Use `--config` to load settings from a YAML configuration file. CLI flags always take precedence over config file values.

### Options

```
  -c, --config string   config file (e.g. .vypher.yaml)
  -h, --help            help for vypher
```

### Configuration File

Vypher can load default settings from a YAML configuration file, which is useful for teams or projects with consistent scan requirements. Pass the path with `--config`:

```bash
vypher scan --config .vypher.yaml
```

**All supported fields:**

```yaml
# Glob patterns to exclude from scanning.
# Supports standard glob syntax: *, **, ?, [abc]
exclude:
  - "*_test.go"
  - "*.log"
  - "testdata/**"

# Rule tags to enable. When set, only patterns matching these tags are run.
# Available tags: finance, pii, healthcare, phi, crypto, communication, government
# Omit this field (or leave empty) to run all rules.
rules:
  - finance
  - phi

# Output format: console (default), json, or sarif
output: sarif

# Maximum directory recursion depth. 0 means unlimited.
max_depth: 5

# Exit with code 1 if any findings are detected. Useful for CI/CD pipelines.
fail_on_match: true
```

**Field reference:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `exclude` | list of strings | `[]` | Glob patterns for files/dirs to skip |
| `rules` | list of strings | all rules | Rule tags to enable |
| `output` | string | `console` | Output format (`console`, `json`, `sarif`) |
| `max_depth` | integer | `0` (unlimited) | Maximum scan depth |
| `fail_on_match` | boolean | `false` | Exit code 1 on any finding |

CLI flags always override config file values. For example, `--output json` will override `output: sarif` in the config file.

### SEE ALSO

* [vypher scan](vypher_scan.md) - Scan a directory for PII/PHI
* [vypher version](vypher_version.md) - Print the version of vypher
