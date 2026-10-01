using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public class WorkoutExercise
{
    public int WorkoutId { get; set; }
    public int ExerciseId { get; set; }
    public int Order { get; set; }
    public int Sets { get; set; }
    public int Reps { get; set; }

    [JsonIgnore]
    public Workout Workout { get; set; } = null!;

    public Exercise Exercise { get; set; } = null!;
}
