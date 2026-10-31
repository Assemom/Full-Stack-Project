using Club.Core.Dtos.Booking;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    [Authorize(Roles = "Admin,Coach,Member")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            var isMember = User.IsInRole("Member");
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var response = await _bookingService.CreateBookingAsync(dto, appUserId, isMember);
            return response.Success ? StatusCode(201, response) : BadRequest(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBookings(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            if (page > 0)
            {
                var paged = await _bookingService.GetAllBookingsPagedAsync(page, pageSize, search);
                return paged.Success ? Ok(paged) : BadRequest(paged);
            }
            var response = await _bookingService.GetAllBookingsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("/api/admin/bookings/today")]
        public async Task<IActionResult> GetTodayBookings()
        {
            var response = await _bookingService.GetTodayBookingsAsync(DateTime.UtcNow);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("/api/coach/bookings/mine")]
        public async Task<IActionResult> GetCoachBookings()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(appUserId))
                return Unauthorized();

            var response = await _bookingService.GetCoachBookingsAsync(appUserId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("/api/member/bookings/mine")]
        public async Task<IActionResult> GetMemberBookings()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(appUserId))
                return Unauthorized();

            var response = await _bookingService.GetMemberBookingsAsync(appUserId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var response = await _bookingService.GetBookingByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] UpdateBookingDto dto)
        {
            var isMember = User.IsInRole("Member");
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var response = await _bookingService.UpdateBookingAsync(id, dto, appUserId, isMember);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var role = User.IsInRole("Admin")
                ? "Admin"
                : User.IsInRole("Coach")
                    ? "Coach"
                    : User.IsInRole("Member")
                        ? "Member"
                        : string.Empty;

            var response = await _bookingService.DeleteBookingAsync(
                id,
                appUserId,
                role);

            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}