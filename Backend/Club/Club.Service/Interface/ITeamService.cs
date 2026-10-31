using Club.Core.Dtos;
using Club.Core.Dtos.Team;

namespace Club.Service.Interface
{
    public interface ITeamService
    {
        Task<ApiResponse<TeamDto>> CreateTeamAsync(CreateTeamDto dto);
        Task<ApiResponse<IEnumerable<TeamDto>>> GetAllTeamsAsync();
        Task<ApiResponse<PagedResult<TeamDto>>> GetAllTeamsPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<TeamDto>> GetTeamByIdAsync(int id);
        Task<ApiResponse<TeamDto>> UpdateTeamAsync(int id, UpdateTeamDto dto);
        Task<ApiResponse<bool>> DeleteTeamAsync(int id);
    }
}
