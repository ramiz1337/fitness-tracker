namespace WebApplication1.Models;

public class Muscle
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;


    public ICollection<ExerciseMuscle> ExerciseMuscles { get; set; } = new List<ExerciseMuscle>();
}