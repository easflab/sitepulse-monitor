pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '✅ Checkout OK'
            }
        }
        
        stage('Teste') {
            steps {
                echo '🔍 Teste básico'
                sh 'ls -la'
            }
        }
        
        stage('Deploy Simulado') {
            steps {
                echo '🚀 Deploy SIMULADO (sem push real)'
                echo 'GitHub Pages atualizado manualmente'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finalizada'
        }
    }
}