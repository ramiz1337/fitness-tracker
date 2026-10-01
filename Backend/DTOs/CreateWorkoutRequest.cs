using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs;

public class CreateWorkoutRequest
{
    [Required, MinLength(2), MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsPublic { get; set; } = true;

    [Required, MinLength(1)]
    public List<WorkoutExerciseRequest> Exercises { get; set; } = new();
}

public class WorkoutExerciseRequest
{
    [Range(1, int.MaxValue)]
    public int ExerciseId { get; set; }

    [Range(1, 100)]
    public int Sets { get; set; }

    [Range(1, 1000)]
    public int Reps { get; set; }
}
