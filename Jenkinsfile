pipeline {
    agent any
    environment {
        DOTENV = credentials('env-secret')
    }
    tools {
        nodejs 'node-21'
    }
    triggers {
        // Nightly regression tests on main branch only
        cron(env.BRANCH_NAME == 'main' ? 'H 2 * * *' : '')  // 2 AM UTC daily
    }
    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'conorschmertz-github-creds',
                    url: 'git@github.com:cschmertz/sep-automation-ts.git',
                    branch: "${env.BRANCH_NAME}"
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
                    def tags = ''
                    def testType = ''
                    
                    if (env.BRANCH_NAME == 'main') {
                        // Main branch: smoke on commits, regression on nightly cron
                        if (currentBuild.getBuildCauses('hudson.triggers.TimerTrigger$TimerTriggerCause')) {
                            tags = '@regression'
                            testType = 'Nightly Regression'
                        } else {
                            tags = '@smoke'
                            testType = 'Commit Smoke'
                        }
                    } else if (env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'dev') {
                        // Dev branch: smoke tests for quick feedback
                        tags = '@smoke'
                        testType = 'Development Smoke'
                    } else if (env.BRANCH_NAME.startsWith('release/')) {
                        // Release branches: full regression suite
                        tags = '@regression'
                        testType = 'Release Regression'
                    } else if (env.CHANGE_ID) {
                        // Pull requests: smoke tests only
                        tags = '@smoke'
                        testType = 'Pull Request Smoke'
                    } else {
                        // Feature branches: smoke tests
                        tags = '@smoke'
                        testType = 'Feature Branch Smoke'
                    }
                    
                    echo "Running ${testType} tests with tags: ${tags}"
                    sh "npm run test -- --tags='${tags}'"
                }
            }
        }
    }
    post {
        always {
            script {
                def reportPath = 'reports/cucumber-html-report/index.html'
                if (fileExists(reportPath)) {
                    publishHTML([
                        reportDir: 'reports/cucumber-html-report',
                        reportFiles: 'index.html',
                        reportName: 'Cucumber Report',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                } else {
                    echo "Cucumber HTML report not found — skipping report publishing."
                }
            }
            
            script {
                // Customize notifications based on test type
                def testType = env.BRANCH_NAME == 'main' && 
                              currentBuild.getBuildCauses('hudson.triggers.TimerTrigger$TimerTriggerCause') ? 
                              'Nightly Regression' : 'Smoke Tests'
                
                slackSend (
                    color: currentBuild.currentResult == 'SUCCESS' ? 'good' : 'danger',
                    message: "${testType} - Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' on branch '${env.BRANCH_NAME}' finished with status: ${currentBuild.currentResult} - ${env.BUILD_URL}"
                )
                
                // Only send email for failures or nightly runs
                if (currentBuild.currentResult != 'SUCCESS' || 
                    (env.BRANCH_NAME == 'main' && currentBuild.getBuildCauses('hudson.triggers.TimerTrigger$TimerTriggerCause'))) {
                    mail to: 'your-team@example.com',
                         subject: "Jenkins ${testType} - '${env.JOB_NAME}' on ${env.BRANCH_NAME} - ${currentBuild.currentResult}",
                         body: "Branch: ${env.BRANCH_NAME}\nTest Type: ${testType}\nStatus: ${currentBuild.currentResult}\nBuild: ${env.BUILD_URL}"
                }
            }
        }
    }
}