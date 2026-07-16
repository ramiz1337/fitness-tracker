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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
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
    }
}