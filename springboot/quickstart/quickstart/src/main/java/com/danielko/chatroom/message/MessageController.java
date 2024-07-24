package com.danielko.chatroom.message;

import com.danielko.chatroom.user.UserController;
import com.danielko.chatroom.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserController userController;


    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        System.out.println("Received " + message);
        switch (message.getStatus()) {
            case JOIN:
                System.out.println("User [" + message.getSenderName() + "] has joined.");
                message.setContent(message.getSenderName() + " has joined!");
                messageService.uploadMessage(message);
                break;
            case MESSAGE:
                messageService.uploadMessage(message);
                break;
            case LEAVE:
                System.out.println("Case LEAVE");
                message.setContent(message.getSenderName() + " has left!");
                messageService.uploadMessage(message);
                userController.leaveChat(message.getSenderName());
                break;
        }

        return message;
    }

    @GetMapping("/findMessageWithUsername")
    public boolean findMessageWithUser(@RequestParam String username) {
        return messageService.searchForUsername(username);
    }

    @GetMapping("/fetchMessages")
    public ResponseEntity<List<Message>> getAllMessages() {
        System.out.println("Getting all messages");
        List<Message> allMessages = messageService.getAllMessages();
        System.out.println(allMessages);
        return new ResponseEntity<List<Message>>(messageService.getAllMessages(), HttpStatus.OK);
    }
}

