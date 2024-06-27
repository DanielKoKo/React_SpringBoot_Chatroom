package com.danielko.messages;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    //@GetMapping("api/hello")
    @PostMapping("/receiveMessage")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<List<Message>> receiveMessage(@RequestBody String message) {
        System.out.println("Received message " + message);
        return new ResponseEntity<List<Message>>(messageService.allMessages(), HttpStatus.OK);
    }

    @PostMapping("/getMessages")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<List<Message>> getAllMessages(@RequestBody String message) {
        return new ResponseEntity<List<Message>>(messageService.allMessages(), HttpStatus.OK);
    }
}

