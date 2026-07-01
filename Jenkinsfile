pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '✅ Checkout realizado'
            }
        }
        
        stage('Testes') {
            steps {
                echo '🔍 Verificando arquivos...'
                sh 'ls -la'
            }
        }
        
        stage('Deploy GitHub Pages') {
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    echo '🚀 Iniciando deploy para GitHub Pages...'
                    sh '''
                        git config user.name "Jenkins CI"
                        git config user.email "jenkins@lab.com"
                        git push --force https://${GITHUB_TOKEN}@github.com/easflab/sitepulse-monitor.git HEAD:gh-pages
                    '''
                    echo '✅ Deploy realizado com sucesso!'
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completada com sucesso!'
        }
        failure {
            echo '❌ Pipeline falhou'
        }
    }
}