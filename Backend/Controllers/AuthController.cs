using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApplication1.DTOs;
using WebApplication1.Models;

[ApiController]
[Route("users")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokenService;

    public AuthController(
        AppDbContext db,
        TokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (await _db.Users.AnyAsync(x => x.Email == email))
            return Conflict("User already exists");


        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email
        };

        var hasher = new PasswordHasher<User>();

        user.PasswordHash = hasher.HashPassword(
            user,
            request.Password
        );

        _db.Users.Add(user);
        await _db.SaveChangesAsync();


        return Ok(new UserResponse(
            user.Id,
            user.Name,
            user.Email
        ));
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginUserRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _db.Users
            .FirstOrDefaultAsync(
                x => x.Email == email);


        if (user == null)
            return Unauthorized();


        var hasher = new PasswordHasher<User>();

        var result = hasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password
        );


        if (result == PasswordVerificationResult.Failed)
            return Unauthorized();


        var token = _tokenService.CreateToken(user);

        return Ok(new
        {
            accessToken = token
        });
    }
}
