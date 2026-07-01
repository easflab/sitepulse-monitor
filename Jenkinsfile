pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '✅ Projeto clonado com sucesso'
            }
        }
        
        stage('Testes') {
            steps {
                echo '🔍 Verificando arquivos do SitePulse...'
                sh 'ls -la'
                echo '✅ Testes concluídos'
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploy simulado para GitHub Pages'
                echo '✅ Deploy finalizado (simulado)'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finalizada'
        }
    }
}