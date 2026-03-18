pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        sh 'echo "Checkout already passed."'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'ls -ltr'
        sh 'cd app && npm ci'
      }
    }

    stage('Static Code Analysis') {
      environment {
        SONAR_URL = "http://34.201.116.83:9000"
      }
      steps {
        withCredentials([string(credentialsId: 'sonarqube-credentials', variable: 'SONAR_AUTH_TOKEN')]) {
          // Use sonar-scanner for a Node.js project
          sh '''
            cd app && sonar-scanner \
              -Dsonar.login=$SONAR_AUTH_TOKEN \
              -Dsonar.host.url=${SONAR_URL} \
              -Dsonar.projectKey=node-jenkins-argocd \
              -Dsonar.sources=.
          '''
        }
      }
    }

    stage('Build and Push Docker Image') {
      environment {
        DOCKER_IMAGE = "aniketnitu2026/node-jenkins-argocd:v${BUILD_NUMBER}"
        REGISTRY_CREDENTIALS = credentials('docker-credentials')
      }
      steps {
        script {
          sh 'cd app && docker build -t ${DOCKER_IMAGE} .'
          def dockerImage = docker.image("${DOCKER_IMAGE}")
          docker.withRegistry('https://index.docker.io/v1/', "docker-credentials") {
            dockerImage.push()
          }
        }
      }
    }

    stage('Update Deployment File') {
      environment {
        GIT_REPO_NAME = "DevOps_Project_Node_Jenkins_ArgoCD_AWS_CICD"
        GIT_USER_NAME = "iam-aniket-dutta"
      }
      steps {
        withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
          sh '''
            git config user.email "duttaaniket005@gmail.com"
            git config user.name "Aniket Dutta"
            ls -ltr          
            sed -i "s|aniketnitu2026/node-jenkins-argocd:v[^\"]*|aniketnitu2026/node-jenkins-argocd:v${BUILD_NUMBER}|g" k8-manifests/deploy.yaml
            git add k8-manifests/deploy.yaml
            git commit -m "Update deployment image to version ${BUILD_NUMBER}"
            git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:dev
          '''
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline completed successfully. Image version: v${BUILD_NUMBER}"
    }
    failure {
      echo "Pipeline failed at stage. Check logs above for details."
    }
  }
}