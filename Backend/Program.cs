using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseHttpsRedirection();

app.MapPost("/users/register", async (RegisterUserRequest request, AppDbContext db) =>
{
    var email = request.Email.Trim().ToLowerInvariant();

    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest("Email and password are required.");
    }

    var exists = await db.Users.AnyAsync(user => user.Email == email);

    if (exists)
    {
        return Results.Conflict("User already exists.");
    }

    var hasher = new PasswordHasher<User>();
    var user = new User
    {
        Email = email
    };

    user.PasswordHash = hasher.HashPassword(user, request.Password);

    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/users/{user.Id}", new UserResponse(user.Id, user.Email));
});

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record RegisterUserRequest(string Email, string Password);
record UserResponse(int Id, string Email);

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
