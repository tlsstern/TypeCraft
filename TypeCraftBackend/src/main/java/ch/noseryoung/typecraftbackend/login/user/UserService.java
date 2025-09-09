package ch.noseryoung.typecraftbackend.login.user;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service

public interface UserService {
    void deleteUser(UUID id);

    List<User> getAllUsers();

    User getUserById(UUID id);

    Set<User> getUserByRole(Role role);

    User editRole(UUID id);

    User editStats(UUID id, Double speedInWordsPerMinute, Double successRate);
}
