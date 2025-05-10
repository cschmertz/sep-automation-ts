pipeline {
    agent any

    environment {
        DOTENV = credentials('env-secret')
    }

    parameters {
        string(
            name: 'TEST_TAG',
            defaultValue: '',
            description: 'Optional Cucumber tag to run (e.g., @smoke, @critical). Leave blank for full regression.'
        )
    }

    triggers {
        // Nightly run at midnight (adjust as needed)
        cron('H 0 * * *')
        // You can create a separate job with: cron('H 7 * * *') for smoke tests
    }

    tools {
        nodejs 'node-21'
    }v

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'conorschmertz-github-creds',
                    url: 'git@github.com/cschmertz/sep-automation-ts.git',
                    branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install'
            }
        }

        stage('Setup Env') {
            steps {
                writeFile file: '.env', text: "${DOTENV}"
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def testCommand = 'npm run test'
                    if (params.TEST_TAG?.trim()) {
                        testCommand = "npx cucumber-js --tags '${params.TEST_TAG}'"
                    }
                    sh testCommand
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*.html', allowEmptyArchive: true
        }
    }
}
