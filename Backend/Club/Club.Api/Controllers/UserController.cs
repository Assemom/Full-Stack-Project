using Club.Core.Dtos;
using Club.Core.Entities;
using Club.Repository.Data.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ClubContext _context;

        public UserController(UserManager<AppUser> userManager, ClubContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .OrderBy(u => u.UserName)
                .ToListAsync();

            var userDtos = new List<AdminUserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var profile = await _context.UserProfiles.FindAsync(user.Id);

                userDtos.Add(new AdminUserDto
                {
                    Id = user.Id,
                    UserName = user.UserName ?? "",
                    Email = user.Email ?? "",
                    PhoneNumber = user.PhoneNumber,
                    FullName = profile?.FullName,
                    ImageUrl = profile?.ImageUrl,
                    Roles = roles.ToList(),
                    IsLockedOut = user.LockoutEnabled && user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow,
                    LockoutEnd = user.LockoutEnd?.UtcDateTime,
                });
            }

            return Ok(ApiResponse<IEnumerable<AdminUserDto>>.Ok(userDtos, "Users retrieved successfully"));
        }
    }
}
