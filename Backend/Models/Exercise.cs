namespace WebApplication1.Models;

using System.Text.Json.Serialization;

public class Exercise
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int Reps { get; set; }

    public int Sets { get; set; }

    public ForceType Force { get; set; }

    public LevelType Level { get; set; }

    public MechanicType Mechanic { get; set; }

    public string Equipment { get; set; } = string.Empty;

    public ExerciseCategory Category { get; set; }


    public ICollection<ExerciseMuscle> ExerciseMuscles { get; set; } = new List<ExerciseMuscle>();

    public ICollection<ExerciseInstruction> Instructions { get; set; } = new List<ExerciseInstruction>();
}


public enum ForceType
{
    Push,
    Pull,
    Static
}


public enum LevelType
{
    Beginner,
    Intermediate,
    Advanced
}


public enum MechanicType
{
    Compound,
    Isolation
}


public enum ExerciseCategory
{
    Stretching,
    Plyometrics,
    Strongman,
    Strength
}