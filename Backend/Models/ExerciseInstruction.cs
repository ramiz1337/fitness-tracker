namespace WebApplication1.Models;

using System.Text.Json.Serialization;

public class ExerciseInstruction
{
    public int Id { get; set; }

    public int Order { get; set; }

    public string Text { get; set; } = string.Empty;


    public int ExerciseId { get; set; }

    [JsonIgnore]
    public Exercise Exercise { get; set; } = null!;
}