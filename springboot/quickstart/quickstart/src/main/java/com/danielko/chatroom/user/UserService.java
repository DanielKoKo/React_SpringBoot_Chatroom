package com.danielko.chatroom.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void addUser(List<String> data) {
        User user = new User(data);
        userRepository.save(user);
    }

    public boolean searchForUser(List<String> data) {
        Optional<User> result = userRepository.findByUsernameAndPassword(data.get(0), data.get(1));
        return result.isPresent();
    }
}
