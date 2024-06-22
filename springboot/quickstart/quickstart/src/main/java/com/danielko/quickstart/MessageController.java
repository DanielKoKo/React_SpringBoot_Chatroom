package com.danielko.quickstart;

import org.springframework.web.bind.annotation.*;

@RestController
public class MessageController {

    //@GetMapping("api/hello")
    @PostMapping("/receiveAndSend")
    @CrossOrigin(origins = "http://localhost:5173")
    public String receiveAndSend(@RequestBody String message) {
        return "Received: " + message;
    }
}

