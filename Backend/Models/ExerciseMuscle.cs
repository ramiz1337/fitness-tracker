
namespace WebApplication1.Models;
public class ExerciseMuscle
{
    public int ExerciseId { get; set; }

    public Exercise Exercise { get; set; } = null!;


    public int MuscleId { get; set; }

    public Muscle Muscle { get; set; } = null!;
}