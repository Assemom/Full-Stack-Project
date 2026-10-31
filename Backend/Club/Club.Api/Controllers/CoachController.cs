using System.Security.Claims;
using Club.Core.Dtos.Coach;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/admin/coaches")]
    public class CoachController : ControllerBase
    {
        private readonly ICoachService _coachService;

        public CoachController(ICoachService coachService)
        {
            _coachService = coachService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCoach([FromBody] CreateCoachDto dto)
        {
            var response = await _coachService.CreateCoachAsync(dto);
            return response.Success ? StatusCode(201, response) : BadRequest(response);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCoaches(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            if (page > 0)
            {
                var paged = await _coachService.GetAllCoachesPagedAsync(page, pageSize, search);
                return paged.Success ? Ok(paged) : BadRequest(paged);
            }
            var response = await _coachService.GetAllCoachesAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCoachById(int id)
        {
            var response = await _coachService.GetCoachByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpGet("/api/coach/profile")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> GetMyProfile()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(appUserId))
                return Unauthorized();

            var response = await _coachService.GetCoachByAppUserIdAsync(appUserId);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("/api/coach/profile")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateCoachDto dto)
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(appUserId))
                return Unauthorized();

            var response = await _coachService.UpdateCoachByAppUserIdAsync(appUserId, dto);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCoach(int id, [FromBody] UpdateCoachDto dto)
        {
            var response = await _coachService.UpdateCoachAsync(id, dto);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCoach(int id)
        {
            var response = await _coachService.DeleteCoachAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }
    }
}