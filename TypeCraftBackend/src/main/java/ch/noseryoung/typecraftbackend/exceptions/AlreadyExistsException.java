package ch.noseryoung.typecraftbackend.exceptions;

public class AlreadyExistsException extends RuntimeException {
    public AlreadyExistsException(String message) {
        super(message);
    }

    public AlreadyExistsException(String entity, Object identifier) {
        super(entity + " already exists with identifier: " + identifier);
    }
}
