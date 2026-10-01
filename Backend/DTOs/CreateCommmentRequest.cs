using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs;

public class CreateCommentRequest
{
    [Required]
    [MaxLength(500)]
    public string Text { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Stars { get; set; }

    public int WorkoutId { get; set; }
}