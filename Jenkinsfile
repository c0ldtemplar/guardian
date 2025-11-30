pipeline {
    agent any

    environment {
        // Define environment variables here
        // NODE_ENV = 'production' // Removed to allow installing devDependencies
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Test') {
            steps {
                script {
                    // Check if test script exists using node
                    def hasTestScript = sh(script: "node -e \"if (require('./package.json').scripts.test) process.exit(0); else process.exit(1);\"", returnStatus: true) == 0
                    
                    if (hasTestScript) {
                        try {
                            sh 'npm test'
                        } catch (Exception e) {
                            echo 'Tests failed'
                            currentBuild.result = 'UNSTABLE'
                        }
                    } else {
                        echo 'No test script found in package.json'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                // Run build if it exists
                script {
                    // Check if build script exists using node
                    def hasBuildScript = sh(script: "node -e \"if (require('./package.json').scripts.build) process.exit(0); else process.exit(1);\"", returnStatus: true) == 0
                    
                    if (hasBuildScript) {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Determine deployment strategy based on project type
                    if (fileExists('docker-compose.yml')) {
                        sh 'docker-compose up -d --build'
                    } else if (fileExists('docker-compose.dev.yml')) {
                        sh 'docker-compose -f docker-compose.dev.yml up -d --build'
                    } else if (fileExists('ecosystem.config.js')) {
                        sh 'pm2 reload ecosystem.config.js --env production'
                    } else {
                        echo 'No deployment strategy found (no docker-compose.yml or ecosystem.config.js)'
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
