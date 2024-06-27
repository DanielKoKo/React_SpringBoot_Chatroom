package com.danielko.messages;

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

    //@GetMapping("api/hello")
    @PostMapping("/receiveMessage")
    public ResponseEntity<List<Message>> receiveMessage(@RequestBody List<String> data) {
        System.out.println("Message: " + data);
        messageService.uploadMessage(data);
        return getAllMessages();
    }

    public ResponseEntity<List<Message>> getAllMessages() {
        return new ResponseEntity<List<Message>>(messageService.allMessages(), HttpStatus.OK);
    }
}

