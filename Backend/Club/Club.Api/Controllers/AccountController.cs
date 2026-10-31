using Club.Core.Dtos;
using Club.Core.Dtos.Auth;
using Club.Service.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Club.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserService userService;

        public AccountController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost("login")]
        [EnableRateLimiting("LoginPolicy")]
        public async Task<ActionResult<ApiResponse<UserDto>>> Login(LoginDto dto)
        {
            var response = await userService.LoginAsync(dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<UserDto>>> Register(RegisterDto dto)
        {
            var response = await userService.RegisterAsync(dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
