FROM maven:3.9.8

WORKDIR /springboot/quickstart/quickstart
COPY . .
RUN mvn clean package

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]