using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DTOs;
using WebApplication1.Models;

[ApiController]
[Route("workouts")]
public class WorkoutController : ControllerBase
{
    private readonly AppDbContext _db;

    public WorkoutController(AppDbContext db)
    {
        _db = db;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkoutResponse>>> Search([FromQuery] string? search = null)
    {
        var query = _db.Workouts
            .AsNoTracking()
            .Include(w => w.Author)
            .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise)
            .Where(w => w.IsPublic);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(w => w.Name.Contains(term) ||
                                     (w.Description != null && w.Description.Contains(term)) ||
                                     w.Author.Name.Contains(term));
        }

        var workouts = await query
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(workouts.Select(ToResponse));
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<WorkoutResponse>>> Mine()
    {
        var userId = CurrentUserId();
        var workouts = await GetWorkoutQuery()
            .Where(w => w.AuthorId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(workouts.Select(ToResponse));
    }

    [Authorize]
    [HttpGet("used")]
    public async Task<ActionResult<IEnumerable<WorkoutResponse>>> Used()
    {
        var userId = CurrentUserId();
        var workouts = await GetWorkoutQuery()
            .Where(w => w.Users.Any(u => u.UserId == userId))
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(workouts.Select(ToResponse));
    }

    [AllowAnonymous]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<WorkoutResponse>> Get(int id)
    {
        var workout = await GetWorkoutQuery()
            .FirstOrDefaultAsync(w => w.Id == id && w.IsPublic);

        if (workout == null)
            return NotFound();

        return Ok(ToResponse(workout));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<WorkoutResponse>> Create(CreateWorkoutRequest request)
    {
        var userId = CurrentUserId();
        var exerciseIds = request.Exercises.Select(e => e.ExerciseId).ToList();

        if (exerciseIds.Count != exerciseIds.Distinct().Count())
            return BadRequest("An exercise can only be added once to a workout.");

        var existingExerciseIds = await _db.Exercises
            .Where(e => exerciseIds.Contains(e.Id))
            .Select(e => e.Id)
            .ToListAsync();

        if (existingExerciseIds.Count != exerciseIds.Count)
            return BadRequest("One or more exercises do not exist.");

        var workout = new Workout
        {
            Name = request.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            IsPublic = request.IsPublic,
            AuthorId = userId,
            WorkoutExercises = request.Exercises.Select((exercise, index) => new WorkoutExercise
            {
                ExerciseId = exercise.ExerciseId,
                Order = index + 1,
                Sets = exercise.Sets,
                Reps = exercise.Reps
            }).ToList()
        };

        _db.Workouts.Add(workout);
        await _db.SaveChangesAsync();

        var created = await GetWorkoutQuery().FirstAsync(w => w.Id == workout.Id);
        return CreatedAtAction(nameof(Get), new { id = workout.Id }, ToResponse(created));
    }

    [Authorize]
    [HttpPost("{id:int}/use")]
    public async Task<IActionResult> Use(int id)
    {
        var userId = CurrentUserId();
        var workout = await _db.Workouts
            .FirstOrDefaultAsync(w => w.Id == id && w.IsPublic);

        if (workout == null)
            return NotFound();

        var alreadyUsed = await _db.WorkoutUsers
            .AnyAsync(wu => wu.WorkoutId == id && wu.UserId == userId);

        if (!alreadyUsed)
        {
            _db.WorkoutUsers.Add(new WorkoutUser { WorkoutId = id, UserId = userId });
            await _db.SaveChangesAsync();
        }

        return Ok();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = CurrentUserId();
        var workout = await _db.Workouts
            .FirstOrDefaultAsync(w => w.Id == id && w.AuthorId == userId);

        if (workout == null)
            return NotFound();

        _db.Workouts.Remove(workout);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private IQueryable<Workout> GetWorkoutQuery()
    {
        return _db.Workouts
            .AsNoTracking()
            .Include(w => w.Author)
            .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise);
    }

    private int CurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.Parse(value!);
    }

    private static WorkoutResponse ToResponse(Workout workout)
    {
        return new WorkoutResponse(
            workout.Id,
            workout.Name,
            workout.Description,
            workout.IsPublic,
            workout.AuthorId,
            workout.Author.Name,
            workout.CreatedAt,
            workout.WorkoutExercises
                .OrderBy(we => we.Order)
                .Select(we => new WorkoutExerciseResponse(
                    we.ExerciseId,
                    we.Exercise.Name,
                    we.Order,
                    we.Sets,
                    we.Reps))
                .ToList());
    }
}
