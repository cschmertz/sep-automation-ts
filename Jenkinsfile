pipeline {
    agent any
    environment {
        DOTENV = credentials('env-secret')
    }
    tools {
        nodejs 'node-21'
    }
    triggers {
        // Daily smoke tests at 8 AM UTC for main and dev branches
        cron(env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'dev' ? 'H 8 * * *' : '')
        // Nightly regression tests at 2 AM UTC for dev branch only
        cron(env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'dev' ? 'H 2 * * *' : '')
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
                    
                    // Check if this is a scheduled build
                    def isScheduled = currentBuild.getBuildCauses('hudson.triggers.TimerTrigger$TimerTriggerCause')
                    def currentHour = new Date().format('HH', TimeZone.getTimeZone('UTC')) as Integer
                    
                    if (env.BRANCH_NAME == 'main') {
                        if (isScheduled) {
                            // Daily smoke tests on main (morning)
                            tags = '@smoke'
                            testType = 'Daily Smoke Tests'
                        } else {
                            // Sprint-end merge: full regression
                            tags = '@regression'
                            testType = 'Sprint Merge Regression'
                        }
                    } else if (env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'dev') {
                        if (isScheduled) {
                            // Determine if morning smoke (8 AM) or nightly regression (2 AM)
                            if (currentHour >= 7 && currentHour <= 9) {
                                tags = '@smoke'
                                testType = 'Daily Smoke Tests'
                            } else {
                                tags = '@regression'
                                testType = 'Nightly Regression'
                            }
                        } else {
                            // Feature merge: critical/mini regression tests
                            tags = '@critical'
                            testType = 'Critical Integration Tests'
                        }
                    } else if (env.BRANCH_NAME.startsWith('release/')) {
                        // Release branches: full regression suite
                        tags = '@regression'
                        testType = 'Release Regression'
                    } else {
                        // Feature branches or PRs: no tests (they get deleted after merge)
                        echo "Skipping tests on feature branch - tests run on dev branch after merge"
                        return
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
                // Skip post actions if tests were skipped
                if (env.BRANCH_NAME != 'main' && env.BRANCH_NAME != 'develop' && env.BRANCH_NAME != 'dev' && !env.BRANCH_NAME.startsWith('release/')) {
                    return
                }
                
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
                // Skip notifications if tests were skipped
                if (env.BRANCH_NAME != 'main' && env.BRANCH_NAME != 'develop' && env.BRANCH_NAME != 'dev' && !env.BRANCH_NAME.startsWith('release/')) {
                    return
                }
                
                // Determine test type for notifications
                def isScheduled = currentBuild.getBuildCauses('hudson.triggers.TimerTrigger$TimerTriggerCause')
                def currentHour = new Date().format('HH', TimeZone.getTimeZone('UTC')) as Integer
                def testType = 'Tests'
                
                if (env.BRANCH_NAME == 'main') {
                    testType = isScheduled ? 'Daily Smoke Tests' : 'Sprint Merge Regression'
                } else if (env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'dev') {
                    if (isScheduled) {
                        testType = (currentHour >= 7 && currentHour <= 9) ? 'Daily Smoke Tests' : 'Nightly Regression'
                    } else {
                        testType = 'Critical Integration Tests'
                    }
                }
                
                slackSend (
                    color: currentBuild.currentResult == 'SUCCESS' ? 'good' : 'danger',
                    message: "${testType} - Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' on branch '${env.BRANCH_NAME}' finished with status: ${currentBuild.currentResult} - ${env.BUILD_URL}"
                )
                
                // Send email for failures or important scheduled runs
                if (currentBuild.currentResult != 'SUCCESS' || 
                    (isScheduled && (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'dev'))) {
                    mail to: 'your-team@example.com',
                         subject: "Jenkins ${testType} - '${env.JOB_NAME}' on ${env.BRANCH_NAME} - ${currentBuild.currentResult}",
                         body: "Branch: ${env.BRANCH_NAME}\nTest Type: ${testType}\nStatus: ${currentBuild.currentResult}\nBuild: ${env.BUILD_URL}"
                }
            }
        }
    }
}