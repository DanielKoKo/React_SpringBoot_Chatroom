package com.danielko.messages;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public void uploadMessage(List<String> data) {
        Message message = new Message(data);
        messageRepository.save(message);
    }

    public List<Message> allMessages() {
        return messageRepository.findAll();
    }
}
