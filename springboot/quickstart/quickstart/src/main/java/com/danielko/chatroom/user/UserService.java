package com.danielko.chatroom.user;
import com.danielko.chatroom.message.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void addUser(List<String> data) {
        User user = new User(data);
        userRepository.save(user);
    }

    public List<String> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<String> usernames = new ArrayList<>();

        for (User user : users) {
            usernames.add(user.getUsername());
        }

        return usernames;
    }

    // for checking if user exists (login, register)
    public boolean searchForUsernameAndPassword(List<String> data) {
        return userRepository.existsByUsernameAndPassword(data.get(0), data.get(1));
    }

    // for checking if user is in chatroom
    public boolean searchForUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username);
        userRepository.deleteById(user.getId());
    }
}
