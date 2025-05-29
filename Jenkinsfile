pipeline {
    agent any

    environment {
        DOTENV = credentials('env-secret')
    }

    triggers {
        // GitHub webhook should be configured in your repo settings
        // Example: GitHub -> Settings -> Webhooks -> http://your-jenkins-url/github-webhook/
        
        // Scheduled runs
        cron('H 22 * * *')
        cron('H 6 * * *') 
    }

    tools {
        nodejs 'node-21'
    }

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

        stage('Smoke Tests') {
            when {
                anyOf {
                    triggeredBy cause: 'TimerTrigger'
                    expression { 
                        return new Date().format('H', TimeZone.getTimeZone('UTC')) == '6'
                    }
                }
            }
            steps {
                script {
                    def tags = '@smoke'
                    sh "./gradlew clean test -Dcucumber.filter.tags='${tags}'"
                }
            }
        }

        stage('Regression Tests') {
            when {
                anyOf {
                    triggeredBy cause: 'TimerTrigger'
                    expression { 
                        return new Date().format('H', TimeZone.getTimeZone('UTC')) == '22'
                    }
                }
            }
            steps {
                script {
                    def tags = '@regression'
                    sh "./gradlew clean test -Dcucumber.filter.tags='${tags}'"
                }
            }
        }

        stage('Run Tests on Commit/PR') {
            when {
                not { triggeredBy cause: 'TimerTrigger' }
            }
            steps {
                script {
                    def tags = '@smoke'
                    sh "./gradlew clean test -Dcucumber.filter.tags='${tags}'"
                }
            }
        }
    }

    post {
        always {
            script {
                def reportPath = 'build/reports/cucumber-html-report/index.html'
                if (fileExists(reportPath)) {
                    publishHTML([
                        reportDir: 'build/reports/cucumber-html-report',
                        reportFiles: 'index.html',
                        reportName: 'Cucumber Report',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                } else {
                    echo "Cucumber HTML report not found — skipping report publishing."
                }
            }

            // Slack notification (requires Slack plugin and configured credentials)
            slackSend (
                color: currentBuild.currentResult == 'SUCCESS' ? 'good' : 'danger',
                message: "Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' finished with status: ${currentBuild.currentResult} - ${env.BUILD_URL}"
            )

            // Email notification (replace with your actual team email)
            mail to: 'your-team@example.com',
                 subject: "Jenkins Job '${env.JOB_NAME}' - ${currentBuild.currentResult}",
                 body: "Check build here: ${env.BUILD_URL}"
        }
    }
}
