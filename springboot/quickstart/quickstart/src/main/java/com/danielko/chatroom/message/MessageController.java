package com.danielko.chatroom.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageService messageService;

    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        System.out.println("Received " + message);

        switch (message.getStatus()) {
            case JOIN:
                System.out.println("User [" + message.getSenderName() + "] has joined.");
                message.setContent(message.getSenderName() + " has joined!");
                break;
            case MESSAGE:
                break;
        }

        messageService.uploadMessage(message);
        return message;
    }

//    @PostMapping("/sendAndReceive")
//    public ResponseEntity<List<Message>> receiveMessage(@RequestBody List<String> data) {
//        System.out.println("Message: " + data);
//        messageService.uploadMessage(data);
//        return getAllMessages();
//    }

    @GetMapping("/fetchMessages")
    public ResponseEntity<List<Message>> getAllMessages() {
        System.out.println("Getting all messages");
        List<Message> allMessages = messageService.getAllMessages();
        System.out.println(allMessages);
        return new ResponseEntity<List<Message>>(messageService.getAllMessages(), HttpStatus.OK);
    }
}

