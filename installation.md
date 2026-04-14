# Installation

## Homebrew (macOS and Linux)

The easiest way to install Vypher on macOS and Linux.

```bash
brew install vypher-io/tap/vypher
```

To update to the latest version:

```bash
brew upgrade vypher-io/tap/vypher
```

---

## Scoop (Windows)

The easiest way to install Vypher on Windows.

```powershell
scoop bucket add vypher-io https://github.com/vypher-io/scoop-bucket
scoop install vypher
```

To update to the latest version:

```powershell
scoop update vypher
```

---

## Docker

No installation required. Mount the directory you want to scan as a volume:

```bash
docker run --rm -v "$(pwd)":/scan pseudocoding/vypher scan --target /scan
```

See [Integrations](/integrations/docker) for more Docker usage examples.

---

## Go Install

Requires [Go 1.20+](https://go.dev/dl/).

```bash
go install github.com/vypher-io/cli@latest
```

The `vypher` binary will be placed in `$(go env GOPATH)/bin`. Make sure that directory is on your `PATH`:

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```

---

## Build from Source

```bash
git clone https://github.com/vypher-io/cli.git
cd cli
go build -o vypher .
```

Move the binary somewhere on your `PATH`:

```bash
mv vypher /usr/local/bin/vypher
```

---

## Verify Installation

```bash
vypher --help
```

You should see output like:

```
Vypher is a CLI tool designed to scan directories for Personally Identifiable Information (PII)
and Protected Health Information (PHI) with a focus on finance and healthcare data.

Usage:
  vypher [command]

Available Commands:
  scan        Scan a directory for PII/PHI
  help        Help about any command

Flags:
  -c, --config string   config file (e.g. .vypher.yaml)
  -h, --help            help for vypher
```
