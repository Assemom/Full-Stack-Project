using Club.Core.Dtos;
using Club.Core.Dtos.Plan;

namespace Club.Service.Interface
{
    public interface IPlanService
    {
        Task<ApiResponse<PlanDto>> CreatePlanAsync(CreatePlanDto dto);
        Task<ApiResponse<IEnumerable<PlanDto>>> GetAllPlansAsync();
        Task<ApiResponse<PagedResult<PlanDto>>> GetAllPlansPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<PlanDto>> GetPlanByIdAsync(int id);
        Task<ApiResponse<PlanDto>> UpdatePlanAsync(int id, UpdatePlanDto dto);
        Task<ApiResponse<bool>> DeletePlanAsync(int id);
    }
}