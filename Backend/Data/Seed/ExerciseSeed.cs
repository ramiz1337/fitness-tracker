using WebApplication1.Models;

namespace WebApplication1.Data.Seed;

public static class ExerciseSeed
{
    public static List<Exercise> Get(
        Muscle chest,
        Muscle back,
        Muscle shoulders,
        Muscle biceps,
        Muscle triceps,
        Muscle legs,
        Muscle glutes,
        Muscle abs)
    {
        return new List<Exercise>
        {
            // CHEST

            new()
            {
                Name = "Barbell Bench Press",
                Reps = 8,
                Sets = 4,
                Force = ForceType.Push,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Compound,
                Equipment = "Barbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = chest },
                    new() { Muscle = triceps }
                }
            },

            new()
            {
                Name = "Incline Dumbbell Press",
                Reps = 10,
                Sets = 4,
                Force = ForceType.Push,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Compound,
                Equipment = "Dumbbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = chest },
                    new() { Muscle = shoulders }
                }
            },

            new()
            {
                Name = "Cable Fly",
                Reps = 12,
                Sets = 3,
                Force = ForceType.Push,
                Level = LevelType.Beginner,
                Mechanic = MechanicType.Isolation,
                Equipment = "Cable",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = chest }
                }
            },


            // BACK

            new()
            {
                Name = "Pull Up",
                Reps = 8,
                Sets = 4,
                Force = ForceType.Pull,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Compound,
                Equipment = "Bodyweight",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = back },
                    new() { Muscle = biceps }
                }
            },

            new()
            {
                Name = "Lat Pulldown",
                Reps = 10,
                Sets = 4,
                Force = ForceType.Pull,
                Level = LevelType.Beginner,
                Mechanic = MechanicType.Compound,
                Equipment = "Machine",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = back }
                }
            },

            new()
            {
                Name = "Barbell Row",
                Reps = 8,
                Sets = 4,
                Force = ForceType.Pull,
                Level = LevelType.Advanced,
                Mechanic = MechanicType.Compound,
                Equipment = "Barbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = back },
                    new() { Muscle = biceps }
                }
            },


            // SHOULDERS

            new()
            {
                Name = "Overhead Press",
                Reps = 8,
                Sets = 4,
                Force = ForceType.Push,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Compound,
                Equipment = "Barbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = shoulders }
                }
            },

            new()
            {
                Name = "Lateral Raise",
                Reps = 15,
                Sets = 3,
                Force = ForceType.Push,
                Level = LevelType.Beginner,
                Mechanic = MechanicType.Isolation,
                Equipment = "Dumbbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = shoulders }
                }
            },


            // BICEPS

            new()
            {
                Name = "Barbell Curl",
                Reps = 10,
                Sets = 3,
                Force = ForceType.Pull,
                Level = LevelType.Beginner,
                Mechanic = MechanicType.Isolation,
                Equipment = "Barbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = biceps }
                }
            },

            new()
            {
                Name = "Hammer Curl",
                Reps = 12,
                Sets = 3,
                Force = ForceType.Pull,
                Level = LevelType.Beginner,
                Mechanic = MechanicType.Isolation,
                Equipment = "Dumbbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = biceps }
                }
            },


            // TRICEPS

            new()
            {
                Name = "Triceps Pushdown",
                Reps = 12,
                Sets = 3,
                Force = ForceType.Push,
                Level = LevelType.Beginner,
                Mechanic = MechanicType.Isolation,
                Equipment = "Cable",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = triceps }
                }
            },

            new()
            {
                Name = "Dips",
                Reps = 10,
                Sets = 4,
                Force = ForceType.Push,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Compound,
                Equipment = "Bodyweight",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = triceps },
                    new() { Muscle = chest }
                }
            },


            // LEGS

            new()
            {
                Name = "Back Squat",
                Reps = 8,
                Sets = 4,
                Force = ForceType.Push,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Compound,
                Equipment = "Barbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = legs },
                    new() { Muscle = glutes }
                }
            },

            new()
            {
                Name = "Leg Press",
                Reps = 12,
                Sets = 4,
                Force = ForceType.Push,
                Level = LevelType.Beginner,
                Mechanic = MechanicType.Compound,
                Equipment = "Machine",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = legs }
                }
            },

            new()
            {
                Name = "Romanian Deadlift",
                Reps = 10,
                Sets = 4,
                Force = ForceType.Pull,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Compound,
                Equipment = "Barbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = legs },
                    new() { Muscle = glutes }
                }
            },


            // GLUTES

            new()
            {
                Name = "Hip Thrust",
                Reps = 10,
                Sets = 4,
                Force = ForceType.Push,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Compound,
                Equipment = "Barbell",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = glutes }
                }
            },


            // ABS

            new()
            {
                Name = "Plank",
                Reps = 60,
                Sets = 3,
                Force = ForceType.Static,
                Level = LevelType.Beginner,
                Mechanic = MechanicType.Isolation,
                Equipment = "Bodyweight",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = abs }
                }
            },

            new()
            {
                Name = "Hanging Leg Raise",
                Reps = 12,
                Sets = 3,
                Force = ForceType.Pull,
                Level = LevelType.Intermediate,
                Mechanic = MechanicType.Isolation,
                Equipment = "Bar",
                Category = ExerciseCategory.Strength,
                ExerciseMuscles =
                {
                    new() { Muscle = abs }
                }
            },

            // MORE CHEST

new()
{
    Name = "Dumbbell Bench Press",
    Reps = 10,
    Sets = 4,
    Force = ForceType.Push,
    Level = LevelType.Intermediate,
    Mechanic = MechanicType.Compound,
    Equipment = "Dumbbell",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = chest },
        new() { Muscle = triceps }
    }
},

new()
{
    Name = "Decline Bench Press",
    Reps = 8,
    Sets = 4,
    Force = ForceType.Push,
    Level = LevelType.Advanced,
    Mechanic = MechanicType.Compound,
    Equipment = "Barbell",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = chest }
    }
},

new()
{
    Name = "Push Up",
    Reps = 15,
    Sets = 3,
    Force = ForceType.Push,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Compound,
    Equipment = "Bodyweight",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = chest },
        new() { Muscle = triceps }
    }
},


// MORE BACK

new()
{
    Name = "Deadlift",
    Reps = 5,
    Sets = 5,
    Force = ForceType.Pull,
    Level = LevelType.Advanced,
    Mechanic = MechanicType.Compound,
    Equipment = "Barbell",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = back },
        new() { Muscle = legs },
        new() { Muscle = glutes }
    }
},

new()
{
    Name = "Seated Cable Row",
    Reps = 12,
    Sets = 4,
    Force = ForceType.Pull,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Compound,
    Equipment = "Cable",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = back },
        new() { Muscle = biceps }
    }
},

new()
{
    Name = "Single Arm Dumbbell Row",
    Reps = 10,
    Sets = 4,
    Force = ForceType.Pull,
    Level = LevelType.Intermediate,
    Mechanic = MechanicType.Compound,
    Equipment = "Dumbbell",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = back },
        new() { Muscle = biceps }
    }
},


// MORE SHOULDERS

new()
{
    Name = "Front Raise",
    Reps = 12,
    Sets = 3,
    Force = ForceType.Push,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Isolation,
    Equipment = "Dumbbell",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = shoulders }
    }
},

new()
{
    Name = "Face Pull",
    Reps = 15,
    Sets = 3,
    Force = ForceType.Pull,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Isolation,
    Equipment = "Cable",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = shoulders },
        new() { Muscle = back }
    }
},


// MORE BICEPS

new()
{
    Name = "Preacher Curl",
    Reps = 10,
    Sets = 3,
    Force = ForceType.Pull,
    Level = LevelType.Intermediate,
    Mechanic = MechanicType.Isolation,
    Equipment = "Machine",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = biceps }
    }
},

new()
{
    Name = "Cable Curl",
    Reps = 12,
    Sets = 3,
    Force = ForceType.Pull,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Isolation,
    Equipment = "Cable",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = biceps }
    }
},


// MORE TRICEPS

new()
{
    Name = "Skull Crusher",
    Reps = 10,
    Sets = 3,
    Force = ForceType.Push,
    Level = LevelType.Intermediate,
    Mechanic = MechanicType.Isolation,
    Equipment = "Barbell",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = triceps }
    }
},

new()
{
    Name = "Close Grip Bench Press",
    Reps = 8,
    Sets = 4,
    Force = ForceType.Push,
    Level = LevelType.Advanced,
    Mechanic = MechanicType.Compound,
    Equipment = "Barbell",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = triceps },
        new() { Muscle = chest }
    }
},


// MORE LEGS

new()
{
    Name = "Front Squat",
    Reps = 8,
    Sets = 4,
    Force = ForceType.Push,
    Level = LevelType.Advanced,
    Mechanic = MechanicType.Compound,
    Equipment = "Barbell",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = legs }
    }
},

new()
{
    Name = "Leg Extension",
    Reps = 15,
    Sets = 3,
    Force = ForceType.Push,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Isolation,
    Equipment = "Machine",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = legs }
    }
},

new()
{
    Name = "Leg Curl",
    Reps = 12,
    Sets = 3,
    Force = ForceType.Pull,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Isolation,
    Equipment = "Machine",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = legs }
    }
},

new()
{
    Name = "Calf Raise",
    Reps = 15,
    Sets = 4,
    Force = ForceType.Push,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Isolation,
    Equipment = "Machine",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = legs }
    }
},


// MORE ABS

new()
{
    Name = "Crunch",
    Reps = 20,
    Sets = 3,
    Force = ForceType.Pull,
    Level = LevelType.Beginner,
    Mechanic = MechanicType.Isolation,
    Equipment = "Bodyweight",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = abs }
    }
},

new()
{
    Name = "Russian Twist",
    Reps = 20,
    Sets = 3,
    Force = ForceType.Static,
    Level = LevelType.Intermediate,
    Mechanic = MechanicType.Isolation,
    Equipment = "Bodyweight",
    Category = ExerciseCategory.Strength,
    ExerciseMuscles =
    {
        new() { Muscle = abs }
    }
}
        };
    }
}