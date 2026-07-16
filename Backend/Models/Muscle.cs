namespace WebApplication1.Models;

using System.Text.Json.Serialization;

public class Muscle
{
    public int Id { get; set; }

    public string Name { get; set; } = "";


    [JsonIgnore]
    public ICollection<ExerciseMuscle> ExerciseMuscles { get; set; }
        = new List<ExerciseMuscle>();
}