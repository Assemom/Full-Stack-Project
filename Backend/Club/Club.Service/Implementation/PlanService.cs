using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Plan;
using Club.Core.Entities;
using Club.Repository.Interface;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class PlanService : IPlanService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PlanService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // ─── Create ───────────────────────────────────────────────
        public async Task<ApiResponse<PlanDto>> CreatePlanAsync(CreatePlanDto dto)
        {
            var plan = _mapper.Map<Plan>(dto);
            await _unitOfWork.Plans.AddAsync(plan);
            await _unitOfWork.CompleteAsync();

            var created = await _unitOfWork.Plans.GetByIdWithIncludesAsync(
                plan.Id,
                p => p.Subscriptions);

            return ApiResponse<PlanDto>.Ok(
                _mapper.Map<PlanDto>(created ?? plan),
                "Plan created successfully");
        }

        // ─── Get All ──────────────────────────────────────────────
        public async Task<ApiResponse<IEnumerable<PlanDto>>> GetAllPlansAsync()
        {
            var plans = await _unitOfWork.Plans.GetAllWithIncludesAsync(
                p => p.Subscriptions);

            return ApiResponse<IEnumerable<PlanDto>>.Ok(
                _mapper.Map<IEnumerable<PlanDto>>(plans),
                "Plans retrieved successfully");
        }

        public async Task<ApiResponse<PagedResult<PlanDto>>> GetAllPlansPagedAsync(int page, int pageSize, string? search = null)
        {
            var paged = await _unitOfWork.Plans.GetAllPagedAsync(page, pageSize,
                includes: p => p.Subscriptions);

            return ApiResponse<PagedResult<PlanDto>>.Ok(
                new PagedResult<PlanDto>
                {
                    Items = _mapper.Map<List<PlanDto>>(paged.Items),
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                },
                "Plans retrieved successfully");
        }

        // ─── Get By Id ────────────────────────────────────────────
        public async Task<ApiResponse<PlanDto>> GetPlanByIdAsync(int id)
        {
            var plan = await _unitOfWork.Plans.GetByIdWithIncludesAsync(
                id,
                p => p.Subscriptions);

            if (plan is null)
                return ApiResponse<PlanDto>.Fail("The selected plan could not be found. Please choose a different plan.");

            return ApiResponse<PlanDto>.Ok(
                _mapper.Map<PlanDto>(plan),
                "Plan retrieved successfully");
        }

        public async Task<ApiResponse<PlanDto>> UpdatePlanAsync(int id, UpdatePlanDto dto)
        {
            var plan = await _unitOfWork.Plans.GetByIdWithIncludesAsync(
                id,
                p => p.Subscriptions);

            if (plan is null)
                return ApiResponse<PlanDto>.Fail("The selected plan could not be found. Please choose a different plan.");

            _mapper.Map(dto, plan);
            _unitOfWork.Plans.Update(plan);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<PlanDto>.Ok(
                _mapper.Map<PlanDto>(plan),
                "Plan updated successfully");
        }

        // ─── Delete ───────────────────────────────────────────────
        public async Task<ApiResponse<bool>> DeletePlanAsync(int id)
        {
            var plan = await _unitOfWork.Plans.GetByIdWithIncludesAsync(
                id,
                p => p.Subscriptions);

            if (plan is null)
                return ApiResponse<bool>.Fail("The selected plan could not be found.");

            if (plan.Subscriptions.Any(s => s.Status == Core.Enums.SubscriptionStatus.Active))
                return ApiResponse<bool>.Fail("Wait until all active subscriptions expire before deleting this plan.");

            _unitOfWork.Plans.Delete(plan);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.Ok(true, "Plan deleted successfully");
        }
    }
}