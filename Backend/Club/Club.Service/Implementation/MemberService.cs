using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Member;
using Club.Core.Entities;
using Club.Repository.Data.Context;
using Club.Repository.Interface;
using Club.Service.Interface;
using Microsoft.AspNetCore.Identity;

namespace Club.Service.Implementation
{
    public class MemberService : IMemberService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ClubContext _context;

        public MemberService(
            IUnitOfWork unitOfWork,
            UserManager<AppUser> userManager,
            IMapper mapper,
            ClubContext context)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
            _context = context;
        }

        // ─── Create ───────────────────────────────────────────────
        public async Task<ApiResponse<MemberDto>> CreateMemberAsync(CreateMemberDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser is not null)
                return ApiResponse<MemberDto>.Fail("This email is already registered. Please use a different email or log in.");

            // Validate team exists if provided
            if (dto.TeamId.HasValue)
            {
                var teamExists = await _unitOfWork.Teams.ExistsAsync(dto.TeamId.Value);
                if (!teamExists)
                    return ApiResponse<MemberDto>.Fail("The selected team could not be found. Please choose a different team.");
            }

            // 1. Create AppUser
            var appUser = _mapper.Map<AppUser>(dto);
            var result = await _userManager.CreateAsync(appUser, dto.Password);
            if (!result.Succeeded)
                return ApiResponse<MemberDto>.Fail(
                    "We couldn't create the member account. Please check the details and try again.",
                    result.Errors.Select(e => e.Description));

            // 2. Assign role
            await _userManager.AddToRoleAsync(appUser, "Member");

            // 3. Create UserProfile
            var userProfile = _mapper.Map<UserProfile>(dto);
            userProfile.AppUserId = appUser.Id;
            await _context.UserProfiles.AddAsync(userProfile);

            // 4. Create Member
            var member = _mapper.Map<Member>(dto);
            member.AppUserId = appUser.Id;
            await _unitOfWork.Members.AddAsync(member);

            // 5. Save everything
            await _unitOfWork.CompleteAsync();

            // 6. Reload with includes
            var created = await _unitOfWork.Members.GetByIdWithIncludesAsync(member.Id,
                m => m.AppUser,
                m => m.AppUser.UserProfile!,
                m => m.Team,
                m => m.Subscriptions);

            member.AppUser = appUser;
            appUser.UserProfile = userProfile;

            return ApiResponse<MemberDto>.Ok(
                _mapper.Map<MemberDto>(created ?? member),
                "Member created successfully");
        }

        // ─── Get All ──────────────────────────────────────────────
        public async Task<ApiResponse<IEnumerable<MemberDto>>> GetAllMembersAsync()
        {
            var members = await _unitOfWork.Members.GetAllWithIncludesAsync(
                m => m.AppUser,
                m => m.AppUser.UserProfile!,
                m => m.Team,
                m => m.Subscriptions);

            return ApiResponse<IEnumerable<MemberDto>>.Ok(
                _mapper.Map<IEnumerable<MemberDto>>(members),
                "Members retrieved successfully");
        }

        public async Task<ApiResponse<PagedResult<MemberDto>>> GetAllMembersPagedAsync(int page, int pageSize, string? search = null)
        {
            var paged = await _unitOfWork.Members.GetAllPagedAsync(page, pageSize,
                includes: [m => m.AppUser, m => m.AppUser.UserProfile!, m => m.Team, m => m.Subscriptions]);

            return ApiResponse<PagedResult<MemberDto>>.Ok(
                new PagedResult<MemberDto>
                {
                    Items = _mapper.Map<List<MemberDto>>(paged.Items),
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                },
                "Members retrieved successfully");
        }

        // ─── Get By Id ────────────────────────────────────────────
        public async Task<ApiResponse<MemberDto>> GetMemberByIdAsync(int id)
        {
            var member = await _unitOfWork.Members.GetByIdWithIncludesAsync(id,
                m => m.AppUser,
                m => m.AppUser.UserProfile!,
                m => m.Team,
                m => m.Subscriptions);

            if (member is null)
                return ApiResponse<MemberDto>.Fail("Member not found. If you recently registered, try logging out and back in.");

            return ApiResponse<MemberDto>.Ok(
                _mapper.Map<MemberDto>(member),
                "Member retrieved successfully");
        }

        // ─── Get By AppUserId ─────────────────────────────────────
        public async Task<ApiResponse<MemberDto>> GetMemberByAppUserIdAsync(string appUserId)
        {
            var all = await _unitOfWork.Members.GetAllWithIncludesAsync(
                m => m.AppUser,
                m => m.AppUser.UserProfile!,
                m => m.Team,
                m => m.Subscriptions);

            var member = all.FirstOrDefault(m => m.AppUserId == appUserId);

            if (member is null)
                return ApiResponse<MemberDto>.Fail("Member not found. If you recently registered, try logging out and back in.");

            return ApiResponse<MemberDto>.Ok(
                _mapper.Map<MemberDto>(member),
                "Member retrieved successfully");
        }

        // ─── Update By AppUserId ──────────────────────────────────
        public async Task<ApiResponse<MemberDto>> UpdateMemberByAppUserIdAsync(string appUserId, UpdateMemberDto dto)
        {
            var all = await _unitOfWork.Members.GetAllWithIncludesAsync(
                m => m.AppUser,
                m => m.AppUser.UserProfile!,
                m => m.Team,
                m => m.Subscriptions);

            var member = all.FirstOrDefault(m => m.AppUserId == appUserId);

            if (member is null)
                return ApiResponse<MemberDto>.Fail("Member not found.");

            if (dto.TeamId.HasValue)
            {
                var teamExists = await _unitOfWork.Teams.ExistsAsync(dto.TeamId.Value);
                if (!teamExists)
                    return ApiResponse<MemberDto>.Fail("The selected team could not be found.");
            }

            _mapper.Map(dto, member);
            if (member.AppUser.UserProfile is not null)
                _mapper.Map(dto, member.AppUser.UserProfile);
            _mapper.Map(dto, member.AppUser);

            _unitOfWork.Members.Update(member);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<MemberDto>.Ok(
                _mapper.Map<MemberDto>(member),
                "Profile updated successfully");
        }

        // ─── Update ───────────────────────────────────────────────
        public async Task<ApiResponse<MemberDto>> UpdateMemberAsync(int id, UpdateMemberDto dto)
        {
            var member = await _unitOfWork.Members.GetByIdWithIncludesAsync(id,
                m => m.AppUser,
                m => m.AppUser.UserProfile!,
                m => m.Team,
                m => m.Subscriptions);

            if (member is null)
                return ApiResponse<MemberDto>.Fail("Member not found. If you recently registered, try logging out and back in.");

            if (dto.TeamId.HasValue)
            {
                var teamExists = await _unitOfWork.Teams.ExistsAsync(dto.TeamId.Value);
                if (!teamExists)
                    return ApiResponse<MemberDto>.Fail("The selected team could not be found.");
            }

            _mapper.Map(dto, member);
            if (member.AppUser.UserProfile is not null)
                _mapper.Map(dto, member.AppUser.UserProfile);
            _mapper.Map(dto, member.AppUser);

            _unitOfWork.Members.Update(member);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<MemberDto>.Ok(
                _mapper.Map<MemberDto>(member),
                "Member updated successfully");
        }

        // ─── Delete ───────────────────────────────────────────────
        public async Task<ApiResponse<bool>> DeleteMemberAsync(int id)
        {
            var member = await _unitOfWork.Members.GetByIdAsync(id);
            if (member is null)
                return ApiResponse<bool>.Fail("Member not found. If you recently registered, try logging out and back in.");

            var appUser = await _userManager.FindByIdAsync(member.AppUserId);
            if (appUser is not null)
                await _userManager.DeleteAsync(appUser);

            return ApiResponse<bool>.Ok(true, "Member deleted successfully");
        }
    }
}
