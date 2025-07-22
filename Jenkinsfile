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
                    script {
                        writeFile file: '.env', text: """
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
"""
                    }
                    // .env, JAR 파일 전송 & EC2에서 실행 (경로는 실제 빌드 구조 맞춰야 함)
                    bat """
                        echo Step 2: Send .env to EC2
                        C:/Users/M/.ssh/pscp.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:h6fF/KbgIbLrQ4ZjcaJRccjQhrBmBZPu7n3M8VCSEZE" .env ec2-user@ec2-13-209-22-40.ap-northeast-2.compute.amazonaws.com:/home/ec2-user/
                        echo Step 3: Send JAR to EC2
                        C:/Users/M/.ssh/pscp.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:h6fF/KbgIbLrQ4ZjcaJRccjQhrBmBZPu7n3M8VCSEZE" backend/build/libs/app1-0.0.1-SNAPSHOT.jar ec2-user@ec2-13-209-22-40.ap-northeast-2.compute.amazonaws.com:/home/ec2-user/
                        echo Step 4: Restart app on EC2
                        C:/Users/M/.ssh/plink.exe -i C:/Users/M/.ssh/tim.ppk -batch -hostkey "ssh-ed25519 255 SHA256:h6fF/KbgIbLrQ4ZjcaJRccjQhrBmBZPu7n3M8VCSEZE" ec2-user@ec2-13-209-22-40.ap-northeast-2.compute.amazonaws.com ^
                        "pkill -f app1-0.0.1-SNAPSHOT.jar || true; set -a; source /home/ec2-user/.env; set +a; nohup java -jar app1-0.0.1-SNAPSHOT.jar > app.log 2>&1 &"
                        exit 0
                    """
                }
            }
        }
    }
}
