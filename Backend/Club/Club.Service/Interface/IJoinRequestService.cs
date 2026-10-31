using Club.Core.Dtos;
using Club.Core.Dtos.JoinRequests;

namespace Club.Service.Interface
{
    public interface IJoinRequestService
    {
        Task<ApiResponse<JoinRequestDto>> CreateJoinRequestAsync(CreateJoinRequestDto dto, string appUserId);
        Task<ApiResponse<IEnumerable<JoinRequestDto>>> GetMyJoinRequestsAsync(string appUserId);
        Task<ApiResponse<IEnumerable<JoinRequestDto>>> GetPendingJoinRequestsAsync(string appUserId, IList<string> roles);
        Task<ApiResponse<IEnumerable<JoinRequestDto>>> GetAllJoinRequestsAsync();
        Task<ApiResponse<PagedResult<JoinRequestDto>>> GetAllJoinRequestsPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<JoinRequestDto>> RespondToJoinRequestAsync(int id, RespondJoinRequestDto dto, string appUserId, IList<string> roles);
    }
}
