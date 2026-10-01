namespace WebApplication1.DTOs;

public record CommentResponse(
    int Id,
    string Text,
    int Stars,
    DateTime CreatedAt,
    int AuthorId,
    string AuthorName,
    int WorkoutId
);
