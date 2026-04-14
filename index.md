---
layout: home

hero:
  name: "Vypher"
  text: "PII and PHI Scanning CLI"
  tagline: Detect sensitive data before it leaves your codebase.
  image:
    src: /vypher-icon.jpg
    alt: Vypher
  actions:
    - theme: brand
      text: Get Started
      link: /installation
    - theme: alt
      text: CLI Reference
      link: /cli/vypher
    - theme: alt
      text: GitHub
      link: https://github.com/vypher-io/cli

features:
  - icon: 🔍
    title: Deep Scanning
    details: Recursively scans directories with configurable exclude patterns, max-depth control, and smart default ignores for node_modules, dist, and lockfiles.
  - icon: 🏥
    title: Finance & Healthcare Patterns
    details: Pre-configured rules for PCI DSS (Credit Card, SSN, IBAN) and HIPAA (MRN, ICD-10, DOB) with tag-based filtering for targeted scans.
  - icon: ✅
    title: Smart Validation
    details: Luhn algorithm verification and keyword proximity detection reduce false positives and indicate match confidence.
  - icon: ⚡
    title: Blazing Fast
    details: Parallel file scanning auto-scaled to available CPU cores. Built with Go for maximum throughput on large codebases.
  - icon: 📋
    title: Multiple Output Formats
    details: Console, JSON, and SARIF output built in. SARIF is compatible with GitHub Code Scanning for inline PR annotations.
  - icon: 🔗
    title: Integrations
    details: Works with GitHub Actions, GitLab CI/CD, Azure Pipelines, CircleCI, Jenkins, Docker, and Git pre-commit hooks.
---

## Quick Start

Install and run your first scan in under a minute.

**macOS / Linux**
```bash
brew install vypher-io/tap/vypher
```

**Windows**
```powershell
scoop bucket add vypher-io https://github.com/vypher-io/scoop-bucket
scoop install vypher
```

**Docker**
```bash
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan
```

**Run a scan**
```bash
vypher scan --target ./src
```

**Fail on any finding (CI/CD)**
```bash
vypher scan --target . --fail-on-match
```

---

## What Vypher Detects

Vypher ships with 11 built-in detection patterns across finance, healthcare, crypto, and general PII.

| Pattern | Category | Validation |
|---|---|---|
| Credit Card | Finance | Luhn algorithm + keyword proximity |
| SSN | Finance | Format validation + keyword proximity |
| IBAN | Finance | Keyword proximity |
| Email | PII | Format validation |
| Phone | PII | Format validation |
| Date of Birth | Healthcare (HIPAA) | Format validation + keyword proximity |
| Medical Record Number | Healthcare (HIPAA) | Keyword proximity |
| ICD-10 Code | Healthcare (HIPAA) | Format validation |
| Bitcoin Address | Crypto | Format validation |
| Ethereum Address | Crypto | Format validation |
| Solana Address | Crypto | Format validation |

Use `--rules` to filter by tag: `finance`, `healthcare`, `phi`, `crypto`, `pii`.

```bash
vypher scan --target . --rules finance,healthcare
```

---

## Next Steps

- [Installation](/installation) — Homebrew, Scoop, Docker, and build from source
- [vypher scan](/cli/vypher_scan) — Full flag reference, default ignores, and output examples
- [Integrations](/integrations/github-actions) — GitHub Actions, GitLab CI/CD, Docker, Git hooks, and more
