using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using admin.Models;
using Microsoft.IdentityModel.Tokens;

namespace admin.Services
{
    public static class TokenService
    {
        public static string GenerateToken(User user,string time)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("fedaf7d8863b48e197b9287d492b302e");
            int timeExpire = int.Parse(time);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.name.ToString()),
                    new Claim("TokenApi", user.tokenApi),
                    new Claim("Subsidiary", user.subsidiary.ToString()),
                    new Claim("Status", user.status.ToString()),
                    new Claim("Operator", user.operatorId.ToString()),
                    new Claim("Id", user.id.ToString())
                }),
                Expires = DateTime.UtcNow.AddMilliseconds(timeExpire),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}