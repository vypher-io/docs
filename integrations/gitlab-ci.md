# GitLab CI/CD

Vypher integrates with GitLab CI/CD pipelines to scan for PII/PHI on every push or merge request. GitLab's Security Dashboard natively supports SARIF reports, making it easy to surface findings as first-class security vulnerabilities in your project.

## Basic Scan

Add a job to your `.gitlab-ci.yml`:

```yaml
vypher-scan:
  stage: test
  image: alpine:3.21
  before_script:
    - apk add --no-cache curl tar
    - curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
    - mv vypher /usr/local/bin/vypher
  script:
    - vypher scan --target . --fail-on-match
```

## Using Docker (No Install Step)

If Docker-in-Docker is available in your runner, use the image directly:

```yaml
vypher-scan:
  stage: test
  image: pseudocoding/vypher:latest
  script:
    - vypher scan --target . --fail-on-match
```

## SARIF Upload to GitLab Security Dashboard

GitLab can ingest SARIF reports and display findings in the Security tab of merge requests and the project Security Dashboard.

```yaml
vypher-scan:
  stage: test
  image: alpine:3.21
  before_script:
    - apk add --no-cache curl tar
    - curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
    - mv vypher /usr/local/bin/vypher
  script:
    - vypher scan --target . --output sarif --fail-on-match > gl-sast-report.sarif || true
  artifacts:
    reports:
      sast: gl-sast-report.sarif
    when: always
```

> The `|| true` prevents the job from failing before the artifact is uploaded. GitLab will still mark the pipeline as having security findings.

## Scoped Scan by Rule Tag

```yaml
vypher-scan:
  stage: test
  image: alpine:3.21
  before_script:
    - apk add --no-cache curl tar
    - curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
    - mv vypher /usr/local/bin/vypher
  script:
    - vypher scan --target ./src --rules finance,healthcare,phi --fail-on-match
```

## Using a Config File

If you have a `.vypher.yaml` committed to your repo, the job picks it up automatically:

```yaml
  script:
    - vypher scan --config .vypher.yaml --fail-on-match
```

## Running Only on Merge Requests

To limit the scan to merge request pipelines:

```yaml
vypher-scan:
  stage: test
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  script:
    - vypher scan --target . --fail-on-match
```
