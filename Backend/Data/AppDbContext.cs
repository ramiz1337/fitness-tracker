using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Exercise> Exercises => Set<Exercise>();

    public DbSet<ExerciseInstruction> ExerciseInstructions => Set<ExerciseInstruction>();

    public DbSet<ExerciseMuscle> ExerciseMuscles => Set<ExerciseMuscle>();

    public DbSet<Muscle> Muscles => Set<Muscle>();

    public DbSet<Workout> Workouts => Set<Workout>();

    public DbSet<Comment> Comments => Set<Comment>();

    public DbSet<WorkoutExercise> WorkoutExercises => Set<WorkoutExercise>();

    public DbSet<WorkoutUser> WorkoutUsers => Set<WorkoutUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();

        modelBuilder.Entity<Comment>()
            .HasIndex(c => new { c.AuthorId, c.WorkoutId })
            .IsUnique();

        modelBuilder.Entity<ExerciseInstruction>()
            .HasOne(i => i.Exercise)
            .WithMany(e => e.Instructions)
            .HasForeignKey(i => i.ExerciseId);


        modelBuilder.Entity<ExerciseMuscle>()
            .HasKey(em => new { em.ExerciseId, em.MuscleId });


        modelBuilder.Entity<ExerciseMuscle>()
            .HasOne(em => em.Exercise)
            .WithMany(e => e.ExerciseMuscles)
            .HasForeignKey(em => em.ExerciseId);


        modelBuilder.Entity<ExerciseMuscle>()
            .HasOne(em => em.Muscle)
            .WithMany(m => m.ExerciseMuscles)
            .HasForeignKey(em => em.MuscleId);

        modelBuilder.Entity<Workout>()
            .HasOne(w => w.Author)
            .WithMany(u => u.AuthoredWorkouts)
            .HasForeignKey(w => w.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WorkoutExercise>()
            .HasKey(we => new { we.WorkoutId, we.ExerciseId });

        modelBuilder.Entity<WorkoutExercise>()
            .HasOne(we => we.Workout)
            .WithMany(w => w.WorkoutExercises)
            .HasForeignKey(we => we.WorkoutId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WorkoutExercise>()
            .HasOne(we => we.Exercise)
            .WithMany(e => e.WorkoutExercises)
            .HasForeignKey(we => we.ExerciseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WorkoutUser>()
            .HasKey(wu => new { wu.WorkoutId, wu.UserId });

        modelBuilder.Entity<WorkoutUser>()
            .HasOne(wu => wu.Workout)
            .WithMany(w => w.Users)
            .HasForeignKey(wu => wu.WorkoutId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WorkoutUser>()
            .HasOne(wu => wu.User)
            .WithMany(u => u.UsedWorkouts)
            .HasForeignKey(wu => wu.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Author)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Workout)
            .WithMany(w => w.Comments)
            .HasForeignKey(c => c.WorkoutId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
