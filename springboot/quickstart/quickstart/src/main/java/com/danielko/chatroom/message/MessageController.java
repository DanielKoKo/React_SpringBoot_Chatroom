package com.danielko.chatroom.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/sendAndReceive")
    public ResponseEntity<List<Message>> receiveMessage(@RequestBody List<String> data) {
        System.out.println("Message: " + data);
        messageService.uploadMessage(data);
        return getAllMessages();
    }

    @GetMapping("/fetchMessages")
    public ResponseEntity<List<Message>> getAllMessages() {
        System.out.println("Hello!");
        return new ResponseEntity<List<Message>>(messageService.allMessages(), HttpStatus.OK);
    }
}
