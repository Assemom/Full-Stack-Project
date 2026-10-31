using Club.Core.Dtos;
using Club.Core.Dtos.Member;

namespace Club.Service.Interface
{
    public interface IMemberService
    {
        Task<ApiResponse<MemberDto>> CreateMemberAsync(CreateMemberDto dto);
        Task<ApiResponse<IEnumerable<MemberDto>>> GetAllMembersAsync();
        Task<ApiResponse<PagedResult<MemberDto>>> GetAllMembersPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<MemberDto>> GetMemberByIdAsync(int id);
        Task<ApiResponse<MemberDto>> GetMemberByAppUserIdAsync(string appUserId);
        Task<ApiResponse<MemberDto>> UpdateMemberAsync(int id, UpdateMemberDto dto);
        Task<ApiResponse<MemberDto>> UpdateMemberByAppUserIdAsync(string appUserId, UpdateMemberDto dto);
        Task<ApiResponse<bool>> DeleteMemberAsync(int id);
    }
}
