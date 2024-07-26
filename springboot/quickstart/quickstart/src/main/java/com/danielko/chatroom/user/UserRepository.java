package com.danielko.chatroom.user;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    boolean existsByUsernameAndPassword(String username, String password);
    boolean existsByUsername(String username);
    User findByUsername(String username);
    List<User> findAll();
}