namespace WebApplication1.DTOs;
using System.ComponentModel.DataAnnotations;

public class RegisterUserRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    [MinLength(8)]
    [MaxLength(100)]
    public string Password { get; set; } = "";

    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public string Name { get; set; } = "";
}