namespace WebApplication1.Models;

public class ExerciseInstruction
{
    public int Id { get; set; }

    public int Order { get; set; }

    public string Text { get; set; } = string.Empty;


    public int ExerciseId { get; set; }

    public Exercise Exercise { get; set; } = null!;
}