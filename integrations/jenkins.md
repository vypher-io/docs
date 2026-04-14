# Jenkins

Vypher can be integrated into Jenkins pipelines using a `Jenkinsfile`. This works with both declarative and scripted pipelines and supports SARIF output for downstream security reporting.

## Declarative Pipeline

```groovy
pipeline {
  agent any

  stages {
    stage('Install Vypher') {
      steps {
        sh '''
          curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
          mv vypher /usr/local/bin/vypher
        '''
      }
    }

    stage('PII/PHI Scan') {
      steps {
        sh 'vypher scan --target . --fail-on-match'
      }
    }
  }
}
```

## Using Docker Agent (No Install Step)

If your Jenkins environment has Docker available, use the Vypher image as the agent:

```groovy
pipeline {
  agent {
    docker {
      image 'pseudocoding/vypher:latest'
      args '-v $WORKSPACE:/scan'
    }
  }

  stages {
    stage('PII/PHI Scan') {
      steps {
        sh 'vypher scan --target /scan --fail-on-match'
      }
    }
  }
}
```

## SARIF Output with Archiving

Generate a SARIF report and archive it as a build artifact for downstream processing or audit trails:

```groovy
pipeline {
  agent any

  stages {
    stage('Install Vypher') {
      steps {
        sh '''
          curl -sSL https://github.com/vypher-io/cli/releases/latest/download/vypher_linux_amd64.tar.gz | tar -xz
          mv vypher /usr/local/bin/vypher
        '''
      }
    }

    stage('PII/PHI Scan') {
      steps {
        sh 'vypher scan --target . --output sarif > results.sarif || true'
      }
      post {
        always {
          archiveArtifacts artifacts: 'results.sarif', allowEmptyArchive: true
        }
      }
    }
  }

  post {
    failure {
      echo 'PII/PHI findings detected. Review results.sarif for details.'
    }
  }
}
```

## Scoped Scan by Rule Tag

```groovy
    stage('Finance & Healthcare Scan') {
      steps {
        sh 'vypher scan --target ./src --rules finance,healthcare,phi --fail-on-match'
      }
    }
```

## Using a Config File

```groovy
    stage('PII/PHI Scan') {
      steps {
        sh 'vypher scan --config .vypher.yaml --fail-on-match'
      }
    }
```

## Running Only on Specific Branches

```groovy
pipeline {
  agent any

  stages {
    stage('PII/PHI Scan') {
      when {
        anyOf {
          branch 'main'
          branch 'develop'
          changeRequest()
        }
      }
      steps {
        sh 'vypher scan --target . --fail-on-match'
      }
    }
  }
}
```
