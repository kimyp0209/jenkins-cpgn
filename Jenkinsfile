pipeline {
    agent any

    tools {
        jdk 'jdk17'
        gradle 'gradle8.7'
    }

    environment {
        DB_HOST = 'localhost'
        DB_NAME = 'myapp'
        DB_USER = 'jenkins'
        DB_PASS = 'jenkins123'
        UPLOAD_PATH = '/home/ec2-user/uploads'
        MAIL_USER = 'flowercharan0307@gmail.com'
        MAIL_PASSWORD = 'oaov kxrh zfaz mynm'
        TOSS_CLIENT_KEY = 'test_ck_E92LAa5PVbbbmKAkDZmJV7YmpXyJ'
        TOSS_SECRET_KEY = 'test_sk_Z1aOwX7K8mzzkwkOkq2W3yQxzvNP'
        CORS_ALLOWED_ORIGINS = '*'
        OPEN_API_KEY = credentials('OPEN_API_KEY')
        GOOGLE_CLIENT_ID=dummy-client-id
GOOGLE_CLIENT_SECRET=dummy-client-secret
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/kimyp0209/jenkins-cpgn.git'
            }
        }
        stage('Build') {
            steps {
                dir('backend') {
                    bat 'gradlew.bat clean build -x test'
                }
            }
        }
        stage('Create Deploy Script') {
            steps {
                script {
                    writeFile file: 'backend/deploy.sh', text: '''#!/bin/bash
pkill -f app1-0.0.1-SNAPSHOT.jar || true
set -a
source /home/ec2-user/.env
set +a
nohup java -jar /home/ec2-user/app1-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
'''
                }
            }
        }
        stage('Deploy to AWS EC2') {
            steps {
                withCredentials([
                    string(credentialsId: 'OPEN_API_KEY', variable: 'OPEN_API_KEY')
                ]) {
                    script {
                        writeFile file: 'backend/.env', text: """
DB_HOST=${env.DB_HOST}
DB_NAME=${env.DB_NAME}
DB_USER=${env.DB_USER}
DB_PASS=${env.DB_PASS}
UPLOAD_PATH=${env.UPLOAD_PATH}
MAIL_USER=${env.MAIL_USER}
MAIL_PASSWORD=${env.MAIL_PASSWORD}
TOSS_CLIENT_KEY=${env.TOSS_CLIENT_KEY}
TOSS_SECRET_KEY=${env.TOSS_SECRET_KEY}
CORS_ALLOWED_ORIGINS=${env.CORS_ALLOWED_ORIGINS}
OPEN_API_KEY=${env.OPEN_API_KEY}
GOOGLE_CLIENT_ID=dummy-client-id
GOOGLE_CLIENT_SECRET=dummy-client-secret
"""
                    }
                    bat """
echo Step 1: Send .env to EC2
C:/Users/M/.ssh/pscp.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:e3UZ61gWn8QKp1zt6pPOHvyHizzi68t3YPIO4MJJY98" backend/.env ec2-user@ec2-52-79-237-175.ap-northeast-2.compute.amazonaws.com:/home/ec2-user/.env
echo Step 2: Send JAR to EC2
C:/Users/M/.ssh/pscp.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:e3UZ61gWn8QKp1zt6pPOHvyHizzi68t3YPIO4MJJY98" backend/build/libs/app1-0.0.1-SNAPSHOT.jar ec2-user@ec2-52-79-237-175.ap-northeast-2.compute.amazonaws.com:/home/ec2-user/
echo Step 3: Send deploy script to EC2
C:/Users/M/.ssh/pscp.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:e3UZ61gWn8QKp1zt6pPOHvyHizzi68t3YPIO4MJJY98" backend/deploy.sh ec2-user@ec2-52-79-237-175.ap-northeast-2.compute.amazonaws.com:/home/ec2-user/deploy.sh
echo Step 4: Run deploy script on EC2
C:/Users/M/.ssh/plink.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:e3UZ61gWn8QKp1zt6pPOHvyHizzi68t3YPIO4MJJY98" ec2-user@ec2-52-79-237-175.ap-northeast-2.compute.amazonaws.com bash /home/ec2-user/deploy.sh
"""
                }
            }
        }
    }
}
