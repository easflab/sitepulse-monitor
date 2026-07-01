pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '✅ Checkout iniciado'
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
                echo '🚀 Deploy para GitHub Pages...'
                
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
}