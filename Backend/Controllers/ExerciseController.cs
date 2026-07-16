using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.DTOs;

[ApiController]
[Route("exercises")]
public class ExerciseController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExerciseController(AppDbContext db)
    {
        _db = db;
    }


    // GET /exercises
    [HttpGet]
    public async Task<IActionResult> GetAllExercises()
    {
        var exercises = await _db.Exercises
            .Include(e => e.Instructions)
            .Include(e => e.ExerciseMuscles)
                .ThenInclude(em => em.Muscle)
            .ToListAsync();

        return Ok(exercises);
    }


    // GET /exercises/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetExercise(int id)
    {
        var exercise = await _db.Exercises
            .Include(e => e.Instructions)
            .Include(e => e.ExerciseMuscles)
                .ThenInclude(em => em.Muscle)
            .FirstOrDefaultAsync(e => e.Id == id);


        if (exercise == null)
            return NotFound();


        return Ok(exercise);
    }


}