using Club.Core.Dtos;
using Club.Core.Dtos.Subscription;
using Club.Core.Enums;

namespace Club.Service.Interface
{
    public interface ISubscriptionService
    {
        Task<ApiResponse<SubscriptionDto>> CreateSubscriptionAsync(CreateSubscriptionDto dto);
        Task<ApiResponse<IEnumerable<SubscriptionDto>>> GetAllSubscriptionsAsync();
        Task<ApiResponse<PagedResult<SubscriptionDto>>> GetAllSubscriptionsPagedAsync(int page, int pageSize, string? search = null);
        Task<ApiResponse<IEnumerable<SubscriptionDto>>> GetSubscriptionsByStatusAsync(SubscriptionStatus? status);
        Task<ApiResponse<IEnumerable<SubscriptionDto>>> GetMemberSubscriptionsAsync(string appUserId);
        Task<ApiResponse<SubscriptionDto>> GetSubscriptionByIdAsync(int id);
        Task<ApiResponse<SubscriptionDto>> UpdateSubscriptionAsync(int id, UpdateSubscriptionDto dto);
        Task<ApiResponse<bool>> DeleteSubscriptionAsync(int id);
    }
}