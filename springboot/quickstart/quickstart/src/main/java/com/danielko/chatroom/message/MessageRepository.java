package com.danielko.chatroom.message;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, ObjectId> {
    @Query("{ '$or': [ {'senderName': ?0}, {'receiverName': ?1}, {'receiverName': ?2} ] }")
    List<Message> findBySenderAndReceiverNames(String senderName, String receiverName1, String receiverName2);
}
