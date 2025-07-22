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
        GOOGLE_CLIENT_ID = 'dummy-client-id'
        GOOGLE_CLIENT_SECRET = 'dummy-client-secret'
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
        stage('Deploy to AWS EC2') {
            steps {
                withCredentials([
                    string(credentialsId: 'OPEN_API_KEY', variable: 'OPEN_API_KEY')
                ]) {
                    bat """
echo Deploying app on EC2...

C:/Users/M/.ssh/pscp.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:e3UZ61gWn8QKp1zt6pPOHvyHizzi68t3YPIO4MJJY98" backend/build/libs/app1-0.0.1-SNAPSHOT.jar ec2-user@ec2-52-79-237-175.ap-northeast-2.compute.amazonaws.com:/home/ec2-user/

C:/Users/M/.ssh/plink.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:e3UZ61gWn8QKp1zt6pPOHvyHizzi68t3YPIO4MJJY98" ec2-user@ec2-52-79-237-175.ap-northeast-2.compute.amazonaws.com ^
"pkill -f app1-0.0.1-SNAPSHOT.jar || true && \\
export DB_HOST=${env.DB_HOST} && \\
export DB_NAME=${env.DB_NAME} && \\
export DB_USER=${env.DB_USER} && \\
export DB_PASS=${env.DB_PASS} && \\
export UPLOAD_PATH=${env.UPLOAD_PATH} && \\
export MAIL_USER=${env.MAIL_USER} && \\
export MAIL_PASSWORD=${env.MAIL_PASSWORD} && \\
export TOSS_CLIENT_KEY=${env.TOSS_CLIENT_KEY} && \\
export TOSS_SECRET_KEY=${env.TOSS_SECRET_KEY} && \\
export CORS_ALLOWED_ORIGINS=${env.CORS_ALLOWED_ORIGINS} && \\
export OPENAI_API_KEY=${env.OPEN_API_KEY} && \\
export GOOGLE_CLIENT_ID=${env.GOOGLE_CLIENT_ID} && \\
export GOOGLE_CLIENT_SECRET=${env.GOOGLE_CLIENT_SECRET} && \\
nohup java -jar /home/ec2-user/app1-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
"
"""
                }
            }
        }
    }
}
