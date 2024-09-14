package com.danielko.chatroom.message;

import com.danielko.chatroom.user.UserController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://192.168.1.118:3000") // modify IP address after install
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserController userController;

    @MessageMapping("/message")
    @PostMapping("/postMessage")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        System.out.println("Received " + message);
        switch (message.getStatus()) {
            case JOIN:
                System.out.println("User [" + message.getSenderName() + "] has joined.");
                message.setReceiverName("All");
                message.setContent(message.getSenderName() + " has joined!");
                messageService.uploadMessage(message);
                break;
            case MESSAGE:
                messageService.uploadMessage(message);
                break;
            case LEAVE:
                System.out.println("Case LEAVE");
                message.setReceiverName("All");
                message.setContent(message.getSenderName() + " has left!");
                messageService.uploadMessage(message);
                userController.leaveChat(message.getSenderName());
                break;
        }

        System.out.println("Returning message " + message);
        return message;
    }

    @GetMapping("/fetchMessages")
    public ResponseEntity<List<Message>> getAllMessages(@RequestParam String username) {
        System.out.println("/fetchMessages received username [" + username + "]");
        return new ResponseEntity<List<Message>>(messageService.getMessages(username), HttpStatus.OK);
    }
}

