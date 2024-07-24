package com.danielko.chatroom.message;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends MongoRepository<Message, ObjectId> {
    boolean existsBySenderName(String username);
}
