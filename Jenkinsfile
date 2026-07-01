pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/easflab/sitepulse-monitor.git',
                    credentialsId: 'github'
                echo '✅ Checkout OK'
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
                withCredentials([string(credentialsId: 'github', variable: 'TOKEN')]) {
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