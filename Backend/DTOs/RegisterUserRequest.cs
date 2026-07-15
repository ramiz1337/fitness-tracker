namespace WebApplication1.DTOs;

public record RegisterUserRequest(
    string Email,
    string Password
);