using WebApplication1.Models;

namespace WebApplication1.Data.Seed;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Exercises.Any())
            return;


        // create muscles first
        var chest = new Muscle { Name = "Chest" };
        var back = new Muscle { Name = "Back" };
        var shoulders = new Muscle { Name = "Shoulders" };
        var biceps = new Muscle { Name = "Biceps" };
        var triceps = new Muscle { Name = "Triceps" };
        var legs = new Muscle { Name = "Legs" };
        var glutes = new Muscle { Name = "Glutes" };
        var abs = new Muscle { Name = "Abs" };


        db.Muscles.AddRange(
            chest,
            back,
            shoulders,
            biceps,
            triceps,
            legs,
            glutes,
            abs
        );

        db.SaveChanges();


        // create exercises
        var exercises = ExerciseSeed.Get(
            chest,
            back,
            shoulders,
            biceps,
            triceps,
            legs,
            glutes,
            abs
        );


        db.Exercises.AddRange(exercises);

        db.SaveChanges();
    }
}