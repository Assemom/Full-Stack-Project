using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Subscription;
using Club.Core.Entities;
using Club.Core.Enums;
using Club.Repository.Interface;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;

        public SubscriptionService(IUnitOfWork unitOfWork, IMapper mapper, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        private async Task<int?> GetMemberIdByAppUserIdAsync(string appUserId)
        {
            var members = await _unitOfWork.Members.GetAllAsync();
            return members.FirstOrDefault(m => m.AppUserId == appUserId)?.Id;
        }

        // ─── Create ───────────────────────────────────────────────
        public async Task<ApiResponse<SubscriptionDto>> CreateSubscriptionAsync(CreateSubscriptionDto dto)
        {
            var memberExists = await _unitOfWork.Members.ExistsAsync(dto.MemberId);
            if (!memberExists)
                return ApiResponse<SubscriptionDto>.Fail("Member profile not found. Please log in again.");

            var plan = await _unitOfWork.Plans.GetByIdAsync(dto.PlanId);
            if (plan is null)
                return ApiResponse<SubscriptionDto>.Fail("The selected plan could not be found. Please choose a different plan.");

            var subscription = _mapper.Map<Subscription>(dto);

            subscription.StartDate = dto.StartDate ?? DateTime.UtcNow;
            subscription.EndDate = subscription.StartDate.AddMonths(plan.DurationMonths);
            subscription.Status = dto.Status ?? SubscriptionStatus.Pending;
            subscription.PaymentStatus = dto.PaymentStatus ?? PaymentStatus.Pending;
            subscription.AmountPaid = dto.AmountPaid ?? 0m;

            await _unitOfWork.Subscriptions.AddAsync(subscription);
            await _unitOfWork.CompleteAsync();

            var created = await _unitOfWork.Subscriptions.GetByIdWithIncludesAsync(
                subscription.Id,
                s => s.Member,
                s => s.Member.AppUser,
                s => s.Member.AppUser.UserProfile!,
                s => s.Plan);

            var subDto = _mapper.Map<SubscriptionDto>(created ?? subscription);
            var entity = created ?? subscription;
            _ = _notificationService.NotifyUserAsync(
                entity.Member.AppUserId,
                "Subscription Active",
                $"Welcome! Your {entity.Plan?.Name ?? "plan"} subscription is now active.");

            return ApiResponse<SubscriptionDto>.Ok(
                subDto,
                "Subscription created successfully");
        }

        // ─── Get All ──────────────────────────────────────────────
        public async Task<ApiResponse<IEnumerable<SubscriptionDto>>> GetAllSubscriptionsAsync()
        {
            var subscriptions = await _unitOfWork.Subscriptions.GetAllWithIncludesAsync(
                s => s.Member,
                s => s.Member.AppUser,
                s => s.Member.AppUser.UserProfile!,
                s => s.Plan);

            return ApiResponse<IEnumerable<SubscriptionDto>>.Ok(
                _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions),
                "Subscriptions retrieved successfully");
        }

        public async Task<ApiResponse<PagedResult<SubscriptionDto>>> GetAllSubscriptionsPagedAsync(int page, int pageSize, string? search = null)
        {
            var paged = await _unitOfWork.Subscriptions.GetAllPagedAsync(page, pageSize,
                includes: [s => s.Member, s => s.Member.AppUser, s => s.Member.AppUser.UserProfile!, s => s.Plan]);

            return ApiResponse<PagedResult<SubscriptionDto>>.Ok(
                new PagedResult<SubscriptionDto>
                {
                    Items = _mapper.Map<List<SubscriptionDto>>(paged.Items),
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                },
                "Subscriptions retrieved successfully");
        }

        public async Task<ApiResponse<IEnumerable<SubscriptionDto>>> GetSubscriptionsByStatusAsync(SubscriptionStatus? status)
        {
            var subscriptions = await _unitOfWork.Subscriptions.GetAllWithIncludesAsync(
                s => s.Member,
                s => s.Member.AppUser,
                s => s.Member.AppUser.UserProfile!,
                s => s.Plan);

            var filtered = status.HasValue
                ? subscriptions.Where(s => s.Status == status.Value)
                : subscriptions;

            return ApiResponse<IEnumerable<SubscriptionDto>>.Ok(
                _mapper.Map<IEnumerable<SubscriptionDto>>(filtered),
                "Subscriptions retrieved successfully");
        }

        public async Task<ApiResponse<IEnumerable<SubscriptionDto>>> GetMemberSubscriptionsAsync(string appUserId)
        {
            var memberId = await GetMemberIdByAppUserIdAsync(appUserId);
            if (memberId is null)
                return ApiResponse<IEnumerable<SubscriptionDto>>.Fail("Member profile not found. Please log in again.");

            var subscriptions = await _unitOfWork.Subscriptions.GetAllWithIncludesAsync(
                s => s.Member,
                s => s.Member.AppUser,
                s => s.Member.AppUser.UserProfile!,
                s => s.Plan);

            var memberSubscriptions = subscriptions
                .Where(s => s.MemberId == memberId.Value)
                .OrderByDescending(s => s.EndDate);

            return ApiResponse<IEnumerable<SubscriptionDto>>.Ok(
                _mapper.Map<IEnumerable<SubscriptionDto>>(memberSubscriptions),
                "Subscriptions retrieved successfully");
        }

        // ─── Get By Id ────────────────────────────────────────────
        public async Task<ApiResponse<SubscriptionDto>> GetSubscriptionByIdAsync(int id)
        {
            var subscription = await _unitOfWork.Subscriptions.GetByIdWithIncludesAsync(
                id,
                s => s.Member,
                s => s.Member.AppUser,
                s => s.Member.AppUser.UserProfile!,
                s => s.Plan);

            if (subscription is null)
                return ApiResponse<SubscriptionDto>.Fail("The subscription could not be found. It may have been cancelled.");

            return ApiResponse<SubscriptionDto>.Ok(
                _mapper.Map<SubscriptionDto>(subscription),
                "Subscription retrieved successfully");
        }

        // ─── Update ───────────────────────────────────────────────
        public async Task<ApiResponse<SubscriptionDto>> UpdateSubscriptionAsync(int id, UpdateSubscriptionDto dto)
        {
            var subscription = await _unitOfWork.Subscriptions.GetByIdWithIncludesAsync(
                id,
                s => s.Member,
                s => s.Member.AppUser,
                s => s.Member.AppUser.UserProfile!,
                s => s.Plan);

            if (subscription is null)
                return ApiResponse<SubscriptionDto>.Fail("The subscription could not be found. It may have been cancelled.");

            if (dto.MemberId.HasValue)
            {
                var memberExists = await _unitOfWork.Members.ExistsAsync(dto.MemberId.Value);
                if (!memberExists)
                    return ApiResponse<SubscriptionDto>.Fail("Member profile not found.");
            }

            var planForDuration = subscription.Plan;
            if (dto.PlanId.HasValue)
            {
                planForDuration = await _unitOfWork.Plans.GetByIdAsync(dto.PlanId.Value);
                if (planForDuration is null)
                    return ApiResponse<SubscriptionDto>.Fail("The selected plan could not be found.");
            }

            _mapper.Map(dto, subscription);

            var startDate = dto.StartDate ?? subscription.StartDate;
            subscription.StartDate = startDate;
            subscription.EndDate = startDate.AddMonths(planForDuration.DurationMonths);

            _unitOfWork.Subscriptions.Update(subscription);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<SubscriptionDto>.Ok(
                _mapper.Map<SubscriptionDto>(subscription),
                "Subscription updated successfully");
        }

        // ─── Delete ───────────────────────────────────────────────
        public async Task<ApiResponse<bool>> DeleteSubscriptionAsync(int id)
        {
            var subscription = await _unitOfWork.Subscriptions.GetByIdAsync(id);

            if (subscription is null)
                return ApiResponse<bool>.Fail("The subscription could not be found. It may have been cancelled.");

            _unitOfWork.Subscriptions.Delete(subscription);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.Ok(true, "Subscription deleted successfully");
        }
    }
}