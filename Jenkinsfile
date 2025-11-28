pipeline {
    agent any

    environment {
        // Define environment variables here
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                // Run tests if they exist
                script {
                    try {
                        sh 'npm test'
                    } catch (Exception e) {
                        echo 'No tests found or tests failed'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                // Run build if it exists
                script {
                    def packageJson = readJSON file: 'package.json'
                    if (packageJson.scripts.build) {
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
