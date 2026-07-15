using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


[ApiController]
[Route("users")]
public class UserController : ControllerBase
{

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            Id = User.FindFirstValue(
                ClaimTypes.NameIdentifier),

            Email = User.FindFirstValue(
                ClaimTypes.Email)
        });
    }
}