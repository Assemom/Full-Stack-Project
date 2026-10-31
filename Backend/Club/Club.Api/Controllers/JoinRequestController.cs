using Club.Core.Dtos.JoinRequests;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Club.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JoinRequestController : ControllerBase
    {
        private readonly IJoinRequestService _joinRequestService;

        public JoinRequestController(IJoinRequestService joinRequestService)
        {
            _joinRequestService = joinRequestService;
        }

        [HttpPost]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> CreateJoinRequest([FromBody] CreateJoinRequestDto dto)
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var response = await _joinRequestService.CreateJoinRequestAsync(dto, appUserId);
            return response.Success ? StatusCode(201, response) : BadRequest(response);
        }

        [HttpGet("mine")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> GetMyJoinRequests()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var response = await _joinRequestService.GetMyJoinRequestsAsync(appUserId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin,Coach")]
        public async Task<IActionResult> GetPendingJoinRequests()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            var response = await _joinRequestService.GetPendingJoinRequestsAsync(appUserId, roles);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllJoinRequests(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            if (page > 0)
            {
                var paged = await _joinRequestService.GetAllJoinRequestsPagedAsync(page, pageSize, search);
                return paged.Success ? Ok(paged) : BadRequest(paged);
            }
            var response = await _joinRequestService.GetAllJoinRequestsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{id}/respond")]
        [Authorize(Roles = "Admin,Coach")]
        public async Task<IActionResult> RespondToJoinRequest(int id, [FromBody] RespondJoinRequestDto dto)
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            var response = await _joinRequestService.RespondToJoinRequestAsync(id, dto, appUserId, roles);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
