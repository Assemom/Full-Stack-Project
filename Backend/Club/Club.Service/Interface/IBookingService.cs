using Club.Core.Dtos;
using Club.Core.Dtos.Booking;

namespace Club.Service.Interface
{
    public interface IBookingService
    {
        Task<ApiResponse<BookingDto>> CreateBookingAsync(CreateBookingDto dto, string? appUserId, bool isMember);
        Task<ApiResponse<IEnumerable<BookingDto>>> GetAllBookingsAsync();
        Task<ApiResponse<PagedResult<BookingDto>>> GetAllBookingsPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<IEnumerable<BookingDto>>> GetTodayBookingsAsync(DateTime dateUtc);
        Task<ApiResponse<IEnumerable<BookingDto>>> GetMemberBookingsAsync(string appUserId);
        Task<ApiResponse<IEnumerable<BookingDto>>> GetCoachBookingsAsync(string appUserId);
        Task<ApiResponse<BookingDto>> GetBookingByIdAsync(int id);
        Task<ApiResponse<BookingDto>> UpdateBookingAsync(int id, UpdateBookingDto dto, string? appUserId, bool isMember);
        Task<ApiResponse<bool>> DeleteBookingAsync(
            int id,
            string? appUserId,
            string role);
    }
}