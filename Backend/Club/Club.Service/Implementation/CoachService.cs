using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Coach;
using Club.Core.Entities;
using Club.Repository.Data.Context;
using Club.Repository.Interface;
using Club.Service.Interface;
using Microsoft.AspNetCore.Identity;

namespace Club.Service.Implementation
{
    public class CoachService : ICoachService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper mapper;
        private readonly ClubContext context;

        public CoachService(IUnitOfWork unitOfWork, UserManager<AppUser> userManager, IMapper mapper, ClubContext context)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            this.mapper = mapper;
            this.context = context;
        }

        // ─── Create ───────────────────────────────────────────────
        public async Task<ApiResponse<CoachDto>> CreateCoachAsync(CreateCoachDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser is not null)
                return ApiResponse<CoachDto>.Fail("This email is already registered. Please use a different email or log in.");

            // 1. Create AppUser
            var appUser = mapper.Map<AppUser>(dto);
            var result = await _userManager.CreateAsync(appUser, dto.Password);
            if (!result.Succeeded)
                return ApiResponse<CoachDto>.Fail(
                    "We couldn't create the coach account. Please check the details and try again.",
                    result.Errors.Select(e => e.Description));

            // 2. Assign role
            await _userManager.AddToRoleAsync(appUser, "Coach");

            // 3. Create UserProfile
            var userProfile = mapper.Map<UserProfile>(dto);
            userProfile.AppUserId = appUser.Id;
            await context.UserProfiles.AddAsync(userProfile);

            // 4. Create Coach
            var coach = mapper.Map<Coach>(dto);
            coach.AppUserId = appUser.Id;
            await _unitOfWork.Coaches.AddAsync(coach);

            // 5. Save everything in one shot
            await _unitOfWork.CompleteAsync();

            // 6. Assign for mapper
            coach.AppUser = appUser;
            appUser.UserProfile = userProfile;

            return ApiResponse<CoachDto>.Ok(
                mapper.Map<CoachDto>(coach),
                "Coach created successfully");
        }

        // ─── Get All ──────────────────────────────────────────────
        public async Task<ApiResponse<IEnumerable<CoachDto>>> GetAllCoachesAsync()
        {
            var coaches = await _unitOfWork.Coaches
                .GetAllWithIncludesAsync(
                    c => c.AppUser,
                    c => c.AppUser.UserProfile!
                );

            var result = mapper.Map<IEnumerable<CoachDto>>(coaches);

            return ApiResponse<IEnumerable<CoachDto>>.Ok(result, "Coaches retrieved successfully");
        }

        public async Task<ApiResponse<PagedResult<CoachDto>>> GetAllCoachesPagedAsync(int page, int pageSize, string? search = null)
        {
            var paged = await _unitOfWork.Coaches.GetAllPagedAsync(page, pageSize,
                includes: [c => c.AppUser, c => c.AppUser.UserProfile!]);

            return ApiResponse<PagedResult<CoachDto>>.Ok(
                new PagedResult<CoachDto>
                {
                    Items = mapper.Map<List<CoachDto>>(paged.Items),
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                },
                "Coaches retrieved successfully");
        }

        // ─── Get By Id ────────────────────────────────────────────
        public async Task<ApiResponse<CoachDto>> GetCoachByIdAsync(int id)
        {
            var coach = await _unitOfWork.Coaches
                .GetByIdWithIncludesAsync(id,
                    c => c.AppUser,
                    c => c.AppUser.UserProfile!
                );

            if (coach is null)
                return ApiResponse<CoachDto>.Fail("Coach not found. Please check the coach ID and try again.");

            return ApiResponse<CoachDto>.Ok(
                mapper.Map<CoachDto>(coach),
                "Coach retrieved successfully"
            );
        }

        // ─── Get By AppUserId ─────────────────────────────────────
        public async Task<ApiResponse<CoachDto>> GetCoachByAppUserIdAsync(string appUserId)
        {
            var coach = await _unitOfWork.Coaches
                .GetAllWithIncludesAsync(
                    c => c.AppUser,
                    c => c.AppUser.UserProfile!
                );

            var match = coach.FirstOrDefault(c => c.AppUserId == appUserId);

            if (match is null)
                return ApiResponse<CoachDto>.Fail("Coach profile not found.");

            return ApiResponse<CoachDto>.Ok(
                mapper.Map<CoachDto>(match),
                "Coach profile retrieved successfully"
            );
        }

        // ─── Update By AppUserId ──────────────────────────────────
        public async Task<ApiResponse<CoachDto>> UpdateCoachByAppUserIdAsync(string appUserId, UpdateCoachDto dto)
        {
            var coach = await _unitOfWork.Coaches
                .GetAllWithIncludesAsync(
                    c => c.AppUser,
                    c => c.AppUser.UserProfile!
                );

            var match = coach.FirstOrDefault(c => c.AppUserId == appUserId);

            if (match is null)
                return ApiResponse<CoachDto>.Fail("Coach profile not found.");

            mapper.Map(dto, match);
            mapper.Map(dto, match.AppUser);

            if (match.AppUser.UserProfile is not null)
            {
                mapper.Map(dto, match.AppUser.UserProfile);
            }

            _unitOfWork.Coaches.Update(match);

            await _unitOfWork.CompleteAsync();

            return ApiResponse<CoachDto>.Ok(
                mapper.Map<CoachDto>(match),
                "Coach profile updated successfully");
        }

        // ─── Update ───────────────────────────────────────────────
        public async Task<ApiResponse<CoachDto>> UpdateCoachAsync(int id, UpdateCoachDto dto)
        {
            var coach = await _unitOfWork.Coaches
                .GetByIdWithIncludesAsync(
                    id,
                    c => c.AppUser,
                    c => c.AppUser.UserProfile!);

            if (coach is null)
                return ApiResponse<CoachDto>.Fail("Coach not found. Please check the coach ID and try again.");

            mapper.Map(dto, coach);
            mapper.Map(dto, coach.AppUser);

            if (coach.AppUser.UserProfile is not null)
            {
                mapper.Map(dto, coach.AppUser.UserProfile);
            }

            _unitOfWork.Coaches.Update(coach);

            await _unitOfWork.CompleteAsync();

            return ApiResponse<CoachDto>.Ok(
                mapper.Map<CoachDto>(coach),
                "Coach updated successfully");
        }

        // ─── Delete ───────────────────────────────────────────────
        public async Task<ApiResponse<bool>> DeleteCoachAsync(int id)
        {
            var coach = await _unitOfWork.Coaches.GetByIdAsync(id);

            if (coach is null)
                return ApiResponse<bool>.Fail("Coach not found. Please check the coach ID and try again.");

            var appUser = await _userManager.FindByIdAsync(coach.AppUserId);
            if (appUser is not null)
                await _userManager.DeleteAsync(appUser);

            return ApiResponse<bool>.Ok(true, "Coach deleted successfully");
        }
    }
}
