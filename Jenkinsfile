pipeline {
    agent any

    options {
        skipDefaultCheckout()
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    environment {
        IMAGE_TAG = 'cold2025'
        SERVICE_NAMES = 'guardian-app'
    }

    stages {
        stage('Checkout Infrastructure') {
            steps {
                cleanWs()
                git branch: 'main', url: 'https://github.com/c0ldtemplar/infrastructure.git'
            }
        }

        stage('Configuration') {
            steps {
                script {
                    echo "🔧 Configuring Environment..."
                    sh "echo IMAGE_TAG=${IMAGE_TAG} > .env"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "🚀 Starting Deployment..."
                    def services = SERVICE_NAMES.split(' ')
                    for (service in services) {
                        echo "🔄 Updating ${service}..."
                        sh "docker compose -f docker-compose.ecosystem.yml pull ${service}"
                        sh "docker compose -f docker-compose.ecosystem.yml up -d --no-deps ${service}"
                    }
                    sh "docker system prune -f"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed.'
        }
    }
}
