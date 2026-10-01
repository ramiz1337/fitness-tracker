using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public class Workout
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublic { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int AuthorId { get; set; }

    [JsonIgnore]
    public User Author { get; set; } = null!;

    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    public ICollection<WorkoutUser> Users { get; set; } = new List<WorkoutUser>();
}
