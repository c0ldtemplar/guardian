pipeline {
    agent any
    
    environment {
        // --- CONFIGURACIÓN ESPECÍFICA PARA GUARDIAN ---
        PROJECT_ROOT = '/var/www/guardian'
        INFRA_ROOT = '/var/www/infrastructure'
        APP_PORT = '3015' 
        SERVICE_NAME = 'guardian-app'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                }
                echo "🚀 Iniciando despliegue de Guardian (Commit: ${env.GIT_COMMIT_SHORT})"
            }
        }
        
        stage('Update Source Code') {
            steps {
                script {
                    echo "🔄 Sincronizando código fuente con ${PROJECT_ROOT}..."
                    sh """
                        rsync -rlv --checksum --no-perms --no-owner --no-group \\
                        --exclude='.git' \\
                        --exclude='node_modules' \\
                        --exclude='.next' \\
                        --exclude='.env*' \\
                        --exclude='test-results' \\
                        ./ ${PROJECT_ROOT}/
                    """
                }
            }
        }

        stage('Approval for Production') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    input message: "Desplegar Guardian a Producción?", ok: '🚀 Deploy'
                }
            }
        }
        
        stage('Deploy to Production') {
            steps {
                script {
                    echo "🐳 Reconstruyendo contenedor ${SERVICE_NAME}..."
                    dir(INFRA_ROOT) {
                        sh """
                            docker compose -f docker-compose.ecosystem.yml up -d --no-deps --build --force-recreate ${SERVICE_NAME}
                            docker image prune -f
                        """
                    }
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
        failure {
            echo '❌ El despliegue de Guardian falló.'
        }
        success {
            echo '✅ Despliegue de Guardian completado.'
        }
    }
}
