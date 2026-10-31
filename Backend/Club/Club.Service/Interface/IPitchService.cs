using Club.Core.Dtos;
using Club.Core.Dtos.Pitch;

namespace Club.Service.Interface
{
    public interface IPitchService
    {
        Task<ApiResponse<PitchDto>> CreatePitchAsync(CreatePitchDto dto);
        Task<ApiResponse<IEnumerable<PitchDto>>> GetAllPitchesAsync();
        Task<ApiResponse<PagedResult<PitchDto>>> GetAllPitchesPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<PitchDto>> GetPitchByIdAsync(int id);
        Task<ApiResponse<PitchDto>> UpdatePitchAsync(int id, UpdatePitchDto dto);
        Task<ApiResponse<bool>> DeletePitchAsync(int id);
    }
}