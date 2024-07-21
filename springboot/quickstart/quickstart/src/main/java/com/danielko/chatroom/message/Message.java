package com.danielko.chatroom.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Message {
    private String senderName;
    private String content;
    private Status status;

    public Message(List<String> data) {
        this.senderName = data.get(0);
        this.content = data.get(1);
    }
}
