using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.Models;


public class TokenService
{
    private readonly IConfiguration _config;


    public TokenService(IConfiguration config)
    {
        _config = config;
    }


    public string CreateToken(User user)
    {
        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Email,
                user.Email
            )
        };


        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _config["Jwt:Key"]!
            ));


        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60),
            signingCredentials:
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256
                )
        );


        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}