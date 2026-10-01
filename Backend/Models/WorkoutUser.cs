namespace WebApplication1.Models;

public class WorkoutUser
{
    public int WorkoutId { get; set; }
    public int UserId { get; set; }
    public DateTime UsedAt { get; set; } = DateTime.UtcNow;

    public Workout Workout { get; set; } = null!;
    public User User { get; set; } = null!;
}
