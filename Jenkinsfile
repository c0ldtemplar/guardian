pipeline {
    agent any
    
    environment {
        // --- CONFIGURACIÓN ESPECÍFICA PARA GUARDIAN ---
        PROJECT_ROOT = '/var/www/guardian'
        INFRA_ROOT = '/var/www/infrastructure'
        APP_PORT = '3015' 
        SERVICE_NAME = 'guardian-app'
        IMAGE_NAME = "coldtemplar478/guardian-app"
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
                script {
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                }
                echo "🚀 Iniciando despliegue de Guardian (Commit: ${env.IMAGE_TAG})"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci --legacy-peer-deps'
            }
        }

        stage('Lint') {
            steps {
                script {
                    try {
                        sh 'npm run lint'
                    } catch (Exception e) {
                        echo "⚠️ Linting warnings ignored for now."
                    }
                }
            }
        }
        
        stage('Build Image') {
            steps {
                script {
                    echo "🐳 Construyendo la imagen local ${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                    sh "docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} --build-arg BUILDKIT_INLINE_CACHE=1 ."
                    sh "docker tag ${env.IMAGE_NAME}:${env.IMAGE_TAG} ${env.IMAGE_NAME}:latest || true"
                }
            }
        }
        
        stage('Deploy to Production') {
            steps {
                script {
                    echo "🚚 Desplegando ${env.IMAGE_NAME}:${env.IMAGE_TAG} en producción..."
                    sh """
                        cd ${INFRA_ROOT}
                        export IMAGE_TAG=${env.IMAGE_TAG}
                        docker compose -f docker-compose.ecosystem.yml up -d --no-deps --build --force-recreate ${SERVICE_NAME}
                        docker image prune -f
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo "⏳ Esperando 20 segundos..."
                sleep 20 
                script {
                    def status = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:${APP_PORT} || echo '000'", returnStdout: true).trim()
                    
                    if (status == '200' || status == '307' || status == '308') {
                        echo "✅ Guardian está VIVO en el puerto ${APP_PORT}."
                    } else {
                        echo "⚠️ Alerta: Health Check devolvió ${status}. Revisa logs con 'docker logs ${SERVICE_NAME}'"
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Limpieza del workspace de Jenkins
            cleanWs()
            script {
                // Remove the locally built image from the Jenkins agent
                sh "docker rmi ${env.IMAGE_NAME}:${env.IMAGE_TAG} || true"
                sh "docker rmi ${env.IMAGE_NAME}:latest || true"
            }
        }
        failure {
            echo '❌ El despliegue de Guardian falló.'
        }
        success {
            echo '✅ Despliegue de Guardian completado.'
        }
    }
}
