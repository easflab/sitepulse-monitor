pipeline {
    agent any
    
    environment {
        GITHUB_TOKEN = credentials('github-token')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/easflab/sitepulse-monitor.git',
                    credentialsId: 'github-token'
                echo '✅ Projeto clonado'
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
                sh '''
                    git config user.name "Jenkins CI"
                    git config user.email "jenkins@lab.com"
                    git push --force https://${GITHUB_TOKEN}@github.com/easflab/sitepulse-monitor.git HEAD:gh-pages
                '''
                echo '✅ Deploy no GitHub Pages concluído!'
            }
        }
    }
    
    post {
        success {
            echo '🎉 Sucesso!'
        }
        failure {
            echo '❌ Falha na pipeline'
        }
    }
}