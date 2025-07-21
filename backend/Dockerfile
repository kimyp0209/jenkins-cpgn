FROM openjdk:17-jdk

ARG JAR_FILE=build/libs/app1-0.0.1-SNAPSHOT.jar
#JAR_FILE 복사해서 이름 변경
COPY ${JAR_FILE} app.jar
#java -jar app.jar =
ENTRYPOINT ["java"]
CMD ["-jar", "app.jar"]