using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Team;
using Club.Core.Entities;
using Club.Repository.Interface;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class TeamService : ITeamService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TeamService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // ─── Create ───────────────────────────────────────────────
        public async Task<ApiResponse<TeamDto>> CreateTeamAsync(CreateTeamDto dto)
        {
            // Validate coach exists if provided
            if (dto.CoachId.HasValue)
            {
                var coachExists = await _unitOfWork.Coaches.ExistsAsync(dto.CoachId.Value);
                if (!coachExists)
                    return ApiResponse<TeamDto>.Fail("Coach not found");
            }

            var team = _mapper.Map<Team>(dto);
            await _unitOfWork.Teams.AddAsync(team);
            await _unitOfWork.CompleteAsync();

            // Reload with includes for response
            var created = await _unitOfWork.Teams.GetByIdWithIncludesAsync(team.Id,
                t => t.Coach,
                t => t.Coach.AppUser,
                t => t.Coach.AppUser.UserProfile!,
                t => t.Members);

            return ApiResponse<TeamDto>.Ok(
                _mapper.Map<TeamDto>(created),
                "Team created successfully");
        }

        // ─── Get All ──────────────────────────────────────────────
        public async Task<ApiResponse<IEnumerable<TeamDto>>> GetAllTeamsAsync()
        {
            var teams = await _unitOfWork.Teams.GetAllWithIncludesAsync(
                t => t.Coach,
                t => t.Coach.AppUser,
                t => t.Coach.AppUser.UserProfile!,
                t => t.Members);

            return ApiResponse<IEnumerable<TeamDto>>.Ok(
                _mapper.Map<IEnumerable<TeamDto>>(teams),
                "Teams retrieved successfully");
        }

        public async Task<ApiResponse<PagedResult<TeamDto>>> GetAllTeamsPagedAsync(int page, int pageSize, string? search = null)
        {
            var paged = await _unitOfWork.Teams.GetAllPagedAsync(page, pageSize,
                includes: [t => t.Coach, t => t.Coach.AppUser, t => t.Coach.AppUser.UserProfile!, t => t.Members]);

            return ApiResponse<PagedResult<TeamDto>>.Ok(
                new PagedResult<TeamDto>
                {
                    Items = _mapper.Map<List<TeamDto>>(paged.Items),
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                },
                "Teams retrieved successfully");
        }

        // ─── Get By Id ────────────────────────────────────────────
        public async Task<ApiResponse<TeamDto>> GetTeamByIdAsync(int id)
        {
            var team = await _unitOfWork.Teams.GetByIdWithIncludesAsync(id,
                t => t.Coach,
                t => t.Coach.AppUser,
                t => t.Coach.AppUser.UserProfile!,
                t => t.Members);

            if (team is null)
                return ApiResponse<TeamDto>.Fail("The team could not be found. It may have been removed.");

            return ApiResponse<TeamDto>.Ok(
                _mapper.Map<TeamDto>(team),
                "Team retrieved successfully");
        }

        // ─── Update ───────────────────────────────────────────────
        public async Task<ApiResponse<TeamDto>> UpdateTeamAsync(int id, UpdateTeamDto dto)
        {
            var team = await _unitOfWork.Teams.GetByIdWithIncludesAsync(id,
                t => t.Coach,
                t => t.Coach.AppUser,
                t => t.Coach.AppUser.UserProfile!,
                t => t.Members);

            if (team is null)
                return ApiResponse<TeamDto>.Fail("The team could not be found. It may have been removed.");

            // Validate new coach exists if provided
            if (dto.CoachId.HasValue)
            {
                var coachExists = await _unitOfWork.Coaches.ExistsAsync(dto.CoachId.Value);
                if (!coachExists)
                    return ApiResponse<TeamDto>.Fail("Coach not found");
            }

            _mapper.Map(dto, team);
            _unitOfWork.Teams.Update(team);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<TeamDto>.Ok(
                _mapper.Map<TeamDto>(team),
                "Team updated successfully");
        }

        // ─── Delete ───────────────────────────────────────────────
        public async Task<ApiResponse<bool>> DeleteTeamAsync(int id)
        {
            var team = await _unitOfWork.Teams.GetByIdAsync(id);

            if (team is null)
                return ApiResponse<bool>.Fail("The team could not be found. It may have been removed.");

            _unitOfWork.Teams.Delete(team);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.Ok(true, "Team deleted successfully");
        }
    }
}