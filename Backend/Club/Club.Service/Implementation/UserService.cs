using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Auth;
using Club.Core.Entities;
using Club.Repository.Data.Context;
using Club.Service.Interface;
using Microsoft.AspNetCore.Identity;

namespace Club.Service.Implementation
{
    public class UserService : IUserService
    {
        private readonly ITokenService tokenService;
        private readonly UserManager<AppUser> manager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly IMapper mapper;
        private readonly ClubContext identityContext;

        public UserService(ITokenService tokenService, UserManager<AppUser> manager, SignInManager<AppUser> signInManager, IMapper mapper, ClubContext identityContext)
        {
            this.tokenService = tokenService;
            this.manager = manager;
            this.signInManager = signInManager;
            this.mapper = mapper;
            this.identityContext = identityContext;
        }

        public async Task<ApiResponse<UserDto>> LoginAsync(LoginDto dto)
        {
            var user = await manager.FindByEmailAsync(dto.Email);
            if (user is null)
                return ApiResponse<UserDto>.Fail("Invalid email or password.");

            var result = await signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                return ApiResponse<UserDto>.Fail("Invalid email or password.");

            return ApiResponse<UserDto>.Ok(new UserDto
            {
                Email = user.Email,
                Username = user.UserName,
                Token = await tokenService.CreateTokenAsync(user)
            }, "Login successful.");
        }

        public async Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await manager.FindByEmailAsync(dto.Email);
            if (existingUser is not null)
                return ApiResponse<UserDto>.Fail("This email is already registered. Please use a different email or log in.");

            var user = mapper.Map<AppUser>(dto);
            user.UserName = dto.UserName ?? dto.Email;

            var result = await manager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();

                var friendlyMessages = new List<string>();
                foreach (var err in errors)
                {
                    if (err.Contains("Password", StringComparison.OrdinalIgnoreCase))
                        friendlyMessages.Add("Password must be at least 6 characters with uppercase, lowercase, and a number.");
                    else if (err.Contains("Email", StringComparison.OrdinalIgnoreCase))
                        friendlyMessages.Add("Please enter a valid email address.");
                    else
                        friendlyMessages.Add(err);
                }

                return ApiResponse<UserDto>.Fail(
                    "We couldn't create your account. Please check your details and try again.",
                    friendlyMessages.Distinct().ToList());
            }

            await manager.AddToRoleAsync(user, "Member");

            var profile = new UserProfile
            {
                AppUserId = user.Id,
                FullName = dto.UserName,
                Address = dto.Address,
                AppUser = user
            };

            identityContext.UserProfiles.Add(profile);

            var member = new Member
            {
                AppUserId = user.Id,
                JoinedAt = DateTime.UtcNow
            };
            identityContext.Members.Add(member);

            await identityContext.SaveChangesAsync();

            return ApiResponse<UserDto>.Ok(new UserDto
            {
                Email = user.Email,
                Username = user.UserName,
                Token = await tokenService.CreateTokenAsync(user)
            }, "Account created successfully. Welcome!");
        }
        public async Task<bool> CheckEmailExistAsync(string email)
        {
            return await manager.FindByEmailAsync(email) is not null;
        }
    }
}
