## Introduction
This is a full-stack chatroom built using React.js and Spring Boot in conjunction with MongoDB. The front-end is built with [Vite](https://vitejs.dev/), which provides simple, optimized builds right out of the box.<br><br>
The project is deployed on AWS EC2 and can be accessed [here](http://18.227.81.255:3000). Alternatively, the project can be run locally via the steps below.

## Prerequisites
Ensure the following software is installed on your machine:
* [Node.js](https://nodejs.org/en) - version 14.x or higher
* npm - version 10.x or higher (update using *npm update -g npm* if not)
* [Docker](https://www.docker.com/)
* [Apache Maven](https://maven.apache.org/download.cgi) - version 3.9.x or higher

## Build Steps
1. **Modify IP Addresses** (Temporary Step)  
   Update the IP addresses to match your network's IPv4 address in the following files:
   - `react/src/LoginPage.jsx`
   - `react/src/ChatPage.jsx`
   - `springboot/quickstart/quickstart/src/main/java/com/danielko/chatroom/message/MessageController.java`
   - `springboot/quickstart/quickstart/src/main/java/com/danielko/chatroom/user/UserController.java`

2. **Start the Project**  
   In the project root folder `React_SpringBoot_Chatroom/`, run:
   ```bash
   docker-compose up --build

3. **Start the Application** <br>
   Open http://xxx.xxx.x.xxx:3000 in your web browser, where xxx.xxx.x.xxx is your network's IPv4 address.

## Screenshots
![chatroom_screenshot](https://github.com/user-attachments/assets/943a8b81-9d9b-46ac-8099-de9fd25d5a1d)
