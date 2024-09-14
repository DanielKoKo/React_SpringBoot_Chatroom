# Introduction
This is a full-stack chatroom built using React.js and Spring Boot in conjunction with MongoDB. The front-end is built with [Vite](https://vitejs.dev/), which provides simple, optimized builds right out of the box.

# Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en) - version 14.x or higher
* npm - version 10.x or higher (update using *npm update -g npm* if not)
* [Docker](https://www.docker.com/)
* [Apache Maven](https://maven.apache.org/download.cgi) - version 3.9.x or higher

# Build Steps
1) (Temporary step) Modify the IP addresses to your network's IPv4 address in the following files:
   * react/src/LoginPage.jsx
   * react/src/ChatPage.jsx
   * springboot/quickstart/quickstart/src/main/java/com/danielko/chatroom/message/MessageController.java
   * springboot/quickstart/quickstart/src/main/java/com/danielko/chatroom/user/UserController.java
3) Run *docker-compose up --build* in the project root folder *React_SpringBoot_Chatroom/*
4) Open *xxx.xxx.x.xxx:3000* on your web browser, where (xxx.xxx.x.xxx) is your network's IPv4 address

# Screenshots
![chatroom_screenshot](https://github.com/user-attachments/assets/943a8b81-9d9b-46ac-8099-de9fd25d5a1d)
