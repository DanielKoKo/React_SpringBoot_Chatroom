package com.danielko.chatroom.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @Id
    private ObjectId id;
    private String name;
    private String message;

    public Message(List<String> data) {
        this.name = data.get(0);
        this.message = data.get(1);
    }
}
