package ch.noseryoung.typecraftbackend.login.user;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/v1/api")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //Get Methods
    @GetMapping("/user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsers(){
        return  ResponseEntity.status(HttpStatus.OK).body(userService.getAllUsers());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUser(@PathVariable UUID userId) {
        return  ResponseEntity.status(HttpStatus.OK).body(userService.getUserById(userId));
    }

    @GetMapping("/user/role/{userRole}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Set<User>> getUser(@PathVariable Role userRole) {
        return  ResponseEntity.status(HttpStatus.OK).body(userService.getUserByRole(userRole));
    }

    //Delete Methods
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    //Put Methods
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user/role/{userId}")
    public ResponseEntity<User> editRole(@PathVariable UUID userId) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userService.editRole(userId));
    }

    //Put Methods
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user/stats/{userId}")
    public ResponseEntity<User> editStatistics(
            @PathVariable UUID userId, @RequestParam Double typeSpeedInWordsPerMinute,
            @RequestParam Double successRate) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                userService.editStats(userId, typeSpeedInWordsPerMinute, successRate));
    }
}