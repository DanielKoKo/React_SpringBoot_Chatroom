package com.danielko.chatroom.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public void uploadMessage(Message message) {
        messageRepository.save(message);
    }

    public List<Message> getMessages(String username) {
        return messageRepository.findBySenderAndReceiverNames(username, username, "All");
    }
}
