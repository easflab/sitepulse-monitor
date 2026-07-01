pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/easflab/sitepulse-monitor.git',
                    credentialsId: 'github-token'
                echo '✅ Checkout OK'
            }
        }
        
        stage('Testes') {
            steps {
                echo '🔍 Testes...'
                sh 'ls -la'
            }
        }
        
        stage('Deploy GitHub Pages') {
            steps {
                echo '🚀 Deploy para gh-pages...'
                
                withCredentials([string(credentialsId: 'github-token', variable: 'TOKEN')]) {
                    sh '''
                        git config user.name "Jenkins CI"
                        git config user.email "jenkins@lab.com"
                        git push --force https://${TOKEN}@github.com/easflab/sitepulse-monitor.git HEAD:gh-pages
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 Sucesso!'
        }
        failure {
            echo '❌ Falhou'
        }
    }
}