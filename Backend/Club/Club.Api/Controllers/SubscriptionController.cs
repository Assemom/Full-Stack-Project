using Club.Core.Dtos;
using Club.Core.Dtos.Subscription;
using Club.Core.Enums;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/subscriptions")]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSubscription([FromBody] CreateSubscriptionDto dto)
        {
            var response = await _subscriptionService.CreateSubscriptionAsync(dto);
            return response.Success ? StatusCode(201, response) : BadRequest(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSubscriptions(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            if (page > 0)
            {
                var paged = await _subscriptionService.GetAllSubscriptionsPagedAsync(page, pageSize, search);
                return paged.Success ? Ok(paged) : BadRequest(paged);
            }
            var response = await _subscriptionService.GetAllSubscriptionsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("/api/admin/subscriptions")]
        public async Task<IActionResult> GetSubscriptionsByStatus([FromQuery] string? status)
        {
            SubscriptionStatus? parsedStatus = null;
            if (!string.IsNullOrWhiteSpace(status) && !string.Equals(status, "all", StringComparison.OrdinalIgnoreCase))
            {
                if (!Enum.TryParse(status, true, out SubscriptionStatus statusValue))
                    return BadRequest(ApiResponse<string>.Fail("Invalid status"));

                parsedStatus = statusValue;
            }

            var response = await _subscriptionService.GetSubscriptionsByStatusAsync(parsedStatus);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubscriptionById(int id)
        {
            var response = await _subscriptionService.GetSubscriptionByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpGet("/api/member/subscriptions/mine")]
        public async Task<IActionResult> GetMySubscriptions()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(appUserId))
                return Unauthorized();

            var response = await _subscriptionService.GetMemberSubscriptionsAsync(appUserId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubscription(int id, [FromBody] UpdateSubscriptionDto dto)
        {
            var response = await _subscriptionService.UpdateSubscriptionAsync(id, dto);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscription(int id)
        {
            var response = await _subscriptionService.DeleteSubscriptionAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }
    }
}