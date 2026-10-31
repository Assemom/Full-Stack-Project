using Club.Core.Dtos;
using Club.Core.Dtos.Activity;

namespace Club.Service.Interface
{
    public interface IActivityService
    {
        Task<ApiResponse<ActivityDto>> CreateActivityAsync(CreateActivityDto dto);
        Task<ApiResponse<IEnumerable<ActivityDto>>> GetAllActivitiesAsync();
        Task<ApiResponse<PagedResult<ActivityDto>>> GetAllActivitiesPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<IEnumerable<ActivityDto>>> GetCoachActivitiesAsync(string appUserId);
        Task<ApiResponse<ActivityDto>> GetActivityByIdAsync(int id);
        Task<ApiResponse<ActivityDto>> UpdateActivityAsync(int id, UpdateActivityDto dto);
        Task<ApiResponse<bool>> DeleteActivityAsync(int id);
    }
}