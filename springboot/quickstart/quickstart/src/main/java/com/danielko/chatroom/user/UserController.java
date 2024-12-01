package com.danielko.chatroom.user;
import com.danielko.chatroom.message.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "https://xxx.xxx.x.xxx:3000") // modify IP address after install
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public boolean verifyLogin(@RequestBody List<String> data) {
        return userService.searchForUsernameAndPassword(data);
    }

    @PostMapping("/register")
    public boolean verifyRegister(@RequestBody List<String> data) {
        boolean userExists = userService.searchForUsernameAndPassword(data);

        if (userExists) {
            return false;
        }

        userService.addUser(data);
        return true;
    }

    @GetMapping("/findUsername")
    public boolean findUser(@RequestParam String username) {
        return userService.searchForUsername(username);
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<String>> getUsers() {
        return new ResponseEntity<List<String>>(userService.getAllUsers(), HttpStatus.OK);
    }

    public void leaveChat(String username) {
        userService.deleteUser(username);
    }
}
