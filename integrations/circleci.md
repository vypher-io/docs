# CircleCI

Vypher integrates with CircleCI to automatically scan for PII/PHI on every push or pull request. CircleCI supports SARIF output storage as artifacts for audit trails and downstream tooling.

## Basic Scan

Add a job to your `.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  vypher-scan:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout
      - run:
          name: Install Vypher
          command: |
            curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
            sudo mv vypher /usr/local/bin/vypher
      - run:
          name: Scan for PII/PHI
          command: vypher scan --target . --fail-on-match

workflows:
  security:
    jobs:
      - vypher-scan
```

## Using Docker Executor (No Install Step)

Run Vypher directly using its Docker image as the job executor:

```yaml
version: 2.1

jobs:
  vypher-scan:
    docker:
      - image: pseudocoding/vypher:latest
    steps:
      - checkout
      - run:
          name: Scan for PII/PHI
          command: vypher scan --target . --fail-on-match

workflows:
  security:
    jobs:
      - vypher-scan
```

## SARIF Output with Artifact Storage

Generate a SARIF report and store it as a CircleCI artifact:

```yaml
version: 2.1

jobs:
  vypher-scan:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout
      - run:
          name: Install Vypher
          command: |
            curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
            sudo mv vypher /usr/local/bin/vypher
      - run:
          name: Scan for PII/PHI (SARIF)
          command: vypher scan --target . --output sarif > results.sarif || true
      - store_artifacts:
          path: results.sarif
          destination: vypher-results

workflows:
  security:
    jobs:
      - vypher-scan
```

## Run Only on Pull Requests

Use filters to limit the scan to pull request builds:

```yaml
workflows:
  security:
    jobs:
      - vypher-scan:
          filters:
            branches:
              only:
                - main
                - /pull\/.*/
```

## Scoped Scan by Rule Tag

```yaml
      - run:
          name: Finance and Healthcare Scan
          command: vypher scan --target ./src --rules finance,healthcare,phi --fail-on-match
```

## Using a Config File

```yaml
      - run:
          name: Scan with Project Config
          command: vypher scan --config .vypher.yaml --fail-on-match
```

## Caching the Binary

Cache the Vypher binary across runs to speed up pipelines:

```yaml
      - restore_cache:
          keys:
            - vypher-{{ arch }}-latest
      - run:
          name: Install Vypher
          command: |
            if ! command -v vypher > /dev/null 2>&1; then
              curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
              sudo mv vypher /usr/local/bin/vypher
            fi
      - save_cache:
          key: vypher-{{ arch }}-latest
          paths:
            - /usr/local/bin/vypher
```
