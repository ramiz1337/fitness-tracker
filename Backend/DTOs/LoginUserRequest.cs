namespace WebApplication1.DTOs;
using System.ComponentModel.DataAnnotations;

public class LoginUserRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    [MinLength(8)]
    [MaxLength(100)]
    public string Password { get; set; } = "";
};