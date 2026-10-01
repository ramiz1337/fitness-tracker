namespace WebApplication1.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    public ICollection<Workout> AuthoredWorkouts { get; set; } = new List<Workout>();
    public ICollection<WorkoutUser> UsedWorkouts { get; set; } = new List<WorkoutUser>();
}
