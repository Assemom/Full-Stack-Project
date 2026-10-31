using Club.Core.Dtos;
using Club.Core.Dtos.Coach;

namespace Club.Service.Interface
{
    public interface ICoachService
    {
        Task<ApiResponse<CoachDto>> CreateCoachAsync(CreateCoachDto dto);
        Task<ApiResponse<IEnumerable<CoachDto>>> GetAllCoachesAsync();
        Task<ApiResponse<PagedResult<CoachDto>>> GetAllCoachesPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<CoachDto>> GetCoachByIdAsync(int id);
        Task<ApiResponse<CoachDto>> GetCoachByAppUserIdAsync(string appUserId);
        Task<ApiResponse<CoachDto>> UpdateCoachAsync(int id, UpdateCoachDto dto);
        Task<ApiResponse<CoachDto>> UpdateCoachByAppUserIdAsync(string appUserId, UpdateCoachDto dto);
        Task<ApiResponse<bool>> DeleteCoachAsync(int id);
    }
}
