namespace WebApplication1.DTOs;

public record WorkoutResponse(
    int Id,
    string Name,
    string? Description,
    bool IsPublic,
    int AuthorId,
    string AuthorName,
    DateTime CreatedAt,
    IReadOnlyList<WorkoutExerciseResponse> Exercises
);

public record WorkoutExerciseResponse(
    int ExerciseId,
    string ExerciseName,
    int Order,
    int Sets,
    int Reps
);
