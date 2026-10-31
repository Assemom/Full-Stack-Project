using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Club.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminDashboard()
        {
            var response = await _dashboardService.GetAdminDashboardAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("member")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> GetMemberDashboard()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var response = await _dashboardService.GetMemberDashboardAsync(appUserId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("coach")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> GetCoachDashboard()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var response = await _dashboardService.GetCoachDashboardAsync(appUserId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

    }
}
