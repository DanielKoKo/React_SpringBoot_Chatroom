package com.danielko.chatroom.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public boolean verifyLogin(@RequestBody List<String> data) {
        boolean loggedIn = userService.searchForUser(data);

        if (loggedIn) {
            System.out.println("User " + data.get(0) + " logged in successfully.");
        }
        else {
            System.out.println("User " + data.get(0) + " failed to log in.");
        }
        return loggedIn;
    }

    @PostMapping("/register")
    public boolean verifyRegister(@RequestBody List<String> data) {
        boolean userExists = userService.searchForUser(data);

        if (userExists) {
            return false;
        }

        userService.addUser(data);
        return true;
    }
}
