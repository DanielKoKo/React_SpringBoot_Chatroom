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
        return userService.searchForUser(data);
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
