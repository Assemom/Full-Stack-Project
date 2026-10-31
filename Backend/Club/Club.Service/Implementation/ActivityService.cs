using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Activity;
using Club.Core.Entities;
using Club.Repository.Interface;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class ActivityService : IActivityService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ActivityService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        private async Task<int?> GetCoachIdByAppUserIdAsync(string appUserId)
        {
            var coaches = await _unitOfWork.Coaches.GetAllAsync();
            return coaches.FirstOrDefault(c => c.AppUserId == appUserId)?.Id;
        }

        // ─── Create ───────────────────────────────────────────────
        public async Task<ApiResponse<ActivityDto>> CreateActivityAsync(CreateActivityDto dto)
        {
            if (!await _unitOfWork.Coaches.ExistsAsync(dto.CoachId))
                return ApiResponse<ActivityDto>.Fail("The selected coach could not be found. Please choose a different coach.");

            if (!await _unitOfWork.Teams.ExistsAsync(dto.TeamId))
                return ApiResponse<ActivityDto>.Fail("The selected team could not be found. Please choose a different team.");

            var activity = _mapper.Map<Activity>(dto);
            await _unitOfWork.Activities.AddAsync(activity);
            await _unitOfWork.CompleteAsync();

            var created = await _unitOfWork.Activities.GetByIdWithIncludesAsync(
                activity.Id,
                a => a.Coach,
                a => a.Coach.AppUser,
                a => a.Coach.AppUser.UserProfile!,
                a => a.Team,
                a => a.Team.Members);

            return ApiResponse<ActivityDto>.Ok(
                _mapper.Map<ActivityDto>(created ?? activity),
                "Activity created successfully");
        }

        // ─── Get All ──────────────────────────────────────────────
        public async Task<ApiResponse<IEnumerable<ActivityDto>>> GetAllActivitiesAsync()
        {
            var activities = await _unitOfWork.Activities.GetAllWithIncludesAsync(
                a => a.Coach,
                a => a.Coach.AppUser,
                a => a.Coach.AppUser.UserProfile!,
                a => a.Team,
                a => a.Team.Members);

            return ApiResponse<IEnumerable<ActivityDto>>.Ok(
                _mapper.Map<IEnumerable<ActivityDto>>(activities),
                "Activities retrieved successfully");
        }

        public async Task<ApiResponse<PagedResult<ActivityDto>>> GetAllActivitiesPagedAsync(int page, int pageSize, string? search = null)
        {
            var paged = await _unitOfWork.Activities.GetAllPagedAsync(page, pageSize,
                includes: [a => a.Coach, a => a.Coach.AppUser, a => a.Coach.AppUser.UserProfile!, a => a.Team, a => a.Team.Members]);

            return ApiResponse<PagedResult<ActivityDto>>.Ok(
                new PagedResult<ActivityDto>
                {
                    Items = _mapper.Map<List<ActivityDto>>(paged.Items),
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                },
                "Activities retrieved successfully");
        }

        public async Task<ApiResponse<IEnumerable<ActivityDto>>> GetCoachActivitiesAsync(string appUserId)
        {
            var coachId = await GetCoachIdByAppUserIdAsync(appUserId);
            if (coachId is null)
                return ApiResponse<IEnumerable<ActivityDto>>.Fail("Coach not found");

            var activities = await _unitOfWork.Activities.GetAllWithIncludesAsync(
                a => a.Coach,
                a => a.Coach.AppUser,
                a => a.Coach.AppUser.UserProfile!,
                a => a.Team,
                a => a.Team.Members);

            var coachActivities = activities.Where(a => a.CoachId == coachId.Value);

            return ApiResponse<IEnumerable<ActivityDto>>.Ok(
                _mapper.Map<IEnumerable<ActivityDto>>(coachActivities),
                "Activities retrieved successfully");
        }

        // ─── Get By Id ────────────────────────────────────────────
        public async Task<ApiResponse<ActivityDto>> GetActivityByIdAsync(int id)
        {
            var activity = await _unitOfWork.Activities.GetByIdWithIncludesAsync(
                id,
                a => a.Coach,
                a => a.Coach.AppUser,
                a => a.Coach.AppUser.UserProfile!,
                a => a.Team,
                a => a.Team.Members);

            if (activity is null)
                return ApiResponse<ActivityDto>.Fail("The activity could not be found. It may have been removed.");

            return ApiResponse<ActivityDto>.Ok(
                _mapper.Map<ActivityDto>(activity),
                "Activity retrieved successfully");
        }

        // ─── Update ───────────────────────────────────────────────
        public async Task<ApiResponse<ActivityDto>> UpdateActivityAsync(int id, UpdateActivityDto dto)
        {
            var activity = await _unitOfWork.Activities.GetByIdWithIncludesAsync(
                id,
                a => a.Coach,
                a => a.Coach.AppUser,
                a => a.Coach.AppUser.UserProfile!,
                a => a.Team,
                a => a.Team.Members);

            if (activity is null)
                return ApiResponse<ActivityDto>.Fail("The activity could not be found. It may have been removed.");

            if (dto.CoachId.HasValue && !await _unitOfWork.Coaches.ExistsAsync(dto.CoachId.Value))
                return ApiResponse<ActivityDto>.Fail("The selected coach could not be found.");

            if (dto.TeamId.HasValue && !await _unitOfWork.Teams.ExistsAsync(dto.TeamId.Value))
                return ApiResponse<ActivityDto>.Fail("The selected team could not be found.");

            _mapper.Map(dto, activity);
            _unitOfWork.Activities.Update(activity);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<ActivityDto>.Ok(
                _mapper.Map<ActivityDto>(activity),
                "Activity updated successfully");
        }

        // ─── Delete ───────────────────────────────────────────────
        public async Task<ApiResponse<bool>> DeleteActivityAsync(int id)
        {
            var activity = await _unitOfWork.Activities.GetByIdWithIncludesAsync(
                id,
                a => a.Team,
                a => a.Team.Members);

            if (activity is null)
                return ApiResponse<bool>.Fail("The activity could not be found. It may have been removed.");

            if (activity.IsActive)
                return ApiResponse<bool>.Fail("Please deactivate the activity before deleting it.");

            if (activity.Team.Members.Any())
                return ApiResponse<bool>.Fail("Remove all members from the team before deleting this activity.");

            _unitOfWork.Activities.Delete(activity);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.Ok(true, "Activity deleted successfully");
        }
    }
}