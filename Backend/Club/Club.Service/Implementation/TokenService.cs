using Club.Core.Entities;
using Club.Service.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Club.Service.Implementation
{
    public class TokenService : ITokenService
    {
        private readonly UserManager<AppUser> manager;
        private readonly IConfiguration configuration;

        public TokenService(UserManager<AppUser> manager, IConfiguration configuration)
        {
            this.manager = manager;
            this.configuration = configuration;
        }


        public async Task<string> CreateTokenAsync(AppUser user)
        {
            var authclaims = new List<Claim>() {
                new Claim(ClaimTypes.Email,user.Email ?? ""),
                new Claim(ClaimTypes.NameIdentifier,user.Id ?? ""),
                new Claim(ClaimTypes.MobilePhone,user.PhoneNumber ?? ""),
                new Claim(ClaimTypes.Name,user.UserName ?? "")
                };

            var userRoles = await manager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authclaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                expires: DateTime.Now.AddMinutes(double.Parse(configuration["Jwt:DurationInMinutes"])),
                claims: authclaims,
                signingCredentials: new SigningCredentials(authKey, SecurityAlgorithms.HmacSha256)
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
