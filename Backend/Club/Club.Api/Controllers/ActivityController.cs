using Club.Core.Dtos.Activity;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/activities")]
    public class ActivityController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivityController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Coach")]
        public async Task<IActionResult> CreateActivity([FromBody] CreateActivityDto dto)
        {
            var response = await _activityService.CreateActivityAsync(dto);
            return response.Success ? StatusCode(201, response) : BadRequest(response);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllActivities(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            if (page > 0)
            {
                var paged = await _activityService.GetAllActivitiesPagedAsync(page, pageSize, search);
                return paged.Success ? Ok(paged) : BadRequest(paged);
            }
            var response = await _activityService.GetAllActivitiesAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("/api/coach/activities/mine")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> GetCoachActivities()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(appUserId))
                return Unauthorized();

            var response = await _activityService.GetCoachActivitiesAsync(appUserId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetActivityById(int id)
        {
            var response = await _activityService.GetActivityByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Coach")]
        public async Task<IActionResult> UpdateActivity(int id, [FromBody] UpdateActivityDto dto)
        {
            var response = await _activityService.UpdateActivityAsync(id, dto);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Coach")]
        public async Task<IActionResult> DeleteActivity(int id)
        {
            var response = await _activityService.DeleteActivityAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }
    }
}