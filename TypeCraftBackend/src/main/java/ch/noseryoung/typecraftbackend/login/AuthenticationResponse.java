package ch.noseryoung.typecraftbackend.login;

import ch.noseryoung.typecraftbackend.login.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private User user;
    private String role;
    private UUID personId;
}