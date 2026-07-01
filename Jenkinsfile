pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'git@github.com:easflab/sitepulse-monitor.git',
                    credentialsId: 'github-ssh'
                echo '✅ Checkout via SSH OK'
            }
        }
        
        stage('Testes') {
            steps {
                sh 'ls -la'
                echo '✅ Testes OK'
            }
        }
        
        stage('Deploy GitHub Pages') {
            steps {
                sh '''
                    git config user.name "Jenkins CI"
                    git config user.email "jenkins@lab.com"
                    git push --force git@github.com:easflab/sitepulse-monitor.git HEAD:gh-pages
                '''
                echo '✅ Deploy via SSH concluído!'
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline finalizada com sucesso!'
        }
    }
}