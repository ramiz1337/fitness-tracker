namespace WebApplication1.DTOs;

using System.ComponentModel.DataAnnotations;
using WebApplication1.Models;

public class CreateExerciseRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = "";


    [Required]
    [Range(1, 100)]
    public int Reps { get; set; }


    [Required]
    [Range(1, 50)]
    public int Sets { get; set; }


    [Required]
    public ForceType Force { get; set; }


    [Required]
    public LevelType Level { get; set; }


    [Required]
    public MechanicType Mechanic { get; set; }


    [Required]
    public string Equipment { get; set; } = "";


    [Required]
    public ExerciseCategory Category { get; set; }


    public List<string> Instructions { get; set; } = new();


    public List<int> MuscleIds { get; set; } = new();
}