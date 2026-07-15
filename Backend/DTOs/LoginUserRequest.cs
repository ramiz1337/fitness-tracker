namespace WebApplication1.DTOs;

public record LoginUserRequest(
    string Email,
    string Password
);