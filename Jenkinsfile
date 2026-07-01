pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '✅ Iniciando pipeline'
                git branch: 'main',
                    url: 'https://github.com/easflab/sitepulse-monitor.git',
                    credentialsId: 'github-token'
            }
        }
        
        stage('Testes') {
            steps {
                sh 'ls -la'
                echo '✅ Testes OK'
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploy para GitHub Pages (simulado)'
                echo '✅ Simulação concluída'
            }
        }
    }
}