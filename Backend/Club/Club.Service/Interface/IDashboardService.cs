using Club.Core.Dtos;
using Club.Core.Dtos.Dashboard;

namespace Club.Service.Interface
{
    public interface IDashboardService
    {
        Task<ApiResponse<AdminDashboardDto>> GetAdminDashboardAsync();
        Task<ApiResponse<MemberDashboardDto>> GetMemberDashboardAsync(string appUserId);
        Task<ApiResponse<CoachDashboardDto>> GetCoachDashboardAsync(string appUserId);
    }
}
