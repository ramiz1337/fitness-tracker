using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models;

public class Comment
{
    public int Id { get; set; }

    public string Text { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Range(1, 5)]
    public int Stars { get; set; }

    public int AuthorId { get; set; }

    public int WorkoutId { get; set; }

    [JsonIgnore]
    public User Author { get; set; } = null!;


    [JsonIgnore]
    public Workout Workout { get; set; } = null!;
}