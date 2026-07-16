
namespace WebApplication1.Models;
using System.Text.Json.Serialization;

public class ExerciseMuscle
{
    public int ExerciseId { get; set; }

    public int MuscleId { get; set; }


    [JsonIgnore]
    public Exercise Exercise { get; set; } = null!;


    public Muscle Muscle { get; set; } = null!;
}