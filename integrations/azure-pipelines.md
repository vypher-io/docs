# Azure Pipelines

Vypher integrates with Azure Pipelines to scan for PII/PHI on every build. Azure DevOps supports SARIF report ingestion via the SARIF SAST Scans Tab extension, and SARIF files can be published as pipeline artifacts for audit trails.

## Basic Scan

Add a job to your `azure-pipelines.yml`:

```yaml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self

  - script: |
      curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
      sudo mv vypher /usr/local/bin/vypher
    displayName: Install Vypher

  - script: vypher scan --target . --fail-on-match
    displayName: Scan for PII/PHI
```

## Using Docker (No Install Step)

```yaml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

container: pseudocoding/vypher:latest

steps:
  - checkout: self

  - script: vypher scan --target . --fail-on-match
    displayName: Scan for PII/PHI
```

## SARIF Output with Artifact Publishing

Publish the SARIF report as a pipeline artifact for review in Azure DevOps:

```yaml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self

  - script: |
      curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
      sudo mv vypher /usr/local/bin/vypher
    displayName: Install Vypher

  - script: vypher scan --target . --output sarif > $(Build.ArtifactStagingDirectory)/results.sarif || true
    displayName: Scan for PII/PHI (SARIF)

  - task: PublishBuildArtifacts@1
    condition: always()
    inputs:
      pathToPublish: $(Build.ArtifactStagingDirectory)
      artifactName: vypher-results
    displayName: Publish SARIF Report
```

> Install the [SARIF SAST Scans Tab](https://marketplace.visualstudio.com/items?itemName=sariftools.scans) extension from the Azure DevOps Marketplace to view findings inline in the pipeline UI.

## Pull Request Trigger

Run the scan only on pull requests targeting `main`:

```yaml
trigger: none

pr:
  branches:
    include:
      - main

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self

  - script: |
      curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
      sudo mv vypher /usr/local/bin/vypher
    displayName: Install Vypher

  - script: vypher scan --target . --fail-on-match
    displayName: Scan for PII/PHI
```

## Scoped Scan by Rule Tag

```yaml
  - script: vypher scan --target ./src --rules finance,healthcare,phi --fail-on-match
    displayName: Finance and Healthcare Scan
```

## Using a Config File

```yaml
  - script: vypher scan --config .vypher.yaml --fail-on-match
    displayName: Scan with Project Config
```
