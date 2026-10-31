using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.JoinRequests;
using Club.Core.Entities;
using Club.Core.Enums;
using Club.Repository.Data.Context;
using Club.Repository.Interface;
using Club.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace Club.Service.Implementation
{
    public class JoinRequestService : IJoinRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ClubContext _context;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;

        public JoinRequestService(IUnitOfWork unitOfWork, ClubContext context, IMapper mapper, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        public async Task<ApiResponse<JoinRequestDto>> CreateJoinRequestAsync(CreateJoinRequestDto dto, string appUserId)
        {
            var member = await _context.Members
                .FirstOrDefaultAsync(m => m.AppUserId == appUserId);

            if (member is null)
                return ApiResponse<JoinRequestDto>.Fail("Member profile not found. Please complete your registration.");

            if (!dto.TeamId.HasValue && !dto.ActivityId.HasValue)
                return ApiResponse<JoinRequestDto>.Fail("Please specify which team or activity you'd like to join.");

            if (dto.TeamId.HasValue && dto.ActivityId.HasValue)
                return ApiResponse<JoinRequestDto>.Fail("You can only request to join one team or activity at a time.");

            if (dto.TeamId.HasValue)
            {
                var teamExists = await _context.Teams.AnyAsync(t => t.Id == dto.TeamId.Value);
                if (!teamExists)
                    return ApiResponse<JoinRequestDto>.Fail("The selected team could not be found.");
            }

            if (dto.ActivityId.HasValue)
            {
                var activityExists = await _context.Activities.AnyAsync(a => a.Id == dto.ActivityId.Value);
                if (!activityExists)
                    return ApiResponse<JoinRequestDto>.Fail("The selected activity could not be found.");
            }

            var existingPending = await _context.JoinRequests
                .AnyAsync(j => j.MemberId == member.Id
                    && j.Status == JoinRequestStatus.Pending
                    && ((dto.TeamId.HasValue && j.TeamId == dto.TeamId)
                        || (dto.ActivityId.HasValue && j.ActivityId == dto.ActivityId)));

            if (existingPending)
                return ApiResponse<JoinRequestDto>.Fail("You already have a pending request for this team or activity.");

            var joinRequest = _mapper.Map<JoinRequest>(dto);
            joinRequest.MemberId = member.Id;

            await _unitOfWork.JoinRequests.AddAsync(joinRequest);
            await _unitOfWork.CompleteAsync();

            var created = await _context.JoinRequests
                .Include(j => j.Member).ThenInclude(m => m.AppUser).ThenInclude(u => u.UserProfile)
                .Include(j => j.Team)
                .Include(j => j.Activity)
                .FirstAsync(j => j.Id == joinRequest.Id);

            return ApiResponse<JoinRequestDto>.Ok(
                _mapper.Map<JoinRequestDto>(created),
                "Join request submitted successfully.");
        }

        public async Task<ApiResponse<IEnumerable<JoinRequestDto>>> GetMyJoinRequestsAsync(string appUserId)
        {
            var member = await _context.Members
                .FirstOrDefaultAsync(m => m.AppUserId == appUserId);

            if (member is null)
                return ApiResponse<IEnumerable<JoinRequestDto>>.Fail("Member not found.");

            var requests = await _context.JoinRequests
                .Where(j => j.MemberId == member.Id)
                .Include(j => j.Member).ThenInclude(m => m.AppUser).ThenInclude(u => u.UserProfile)
                .Include(j => j.Team)
                .Include(j => j.Activity)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return ApiResponse<IEnumerable<JoinRequestDto>>.Ok(
                _mapper.Map<IEnumerable<JoinRequestDto>>(requests));
        }

        public async Task<ApiResponse<IEnumerable<JoinRequestDto>>> GetPendingJoinRequestsAsync(string appUserId, IList<string> roles)
        {
            if (roles.Contains("Admin"))
            {
                return await GetAllJoinRequestsAsync();
            }

            var coach = await _context.Coaches
                .FirstOrDefaultAsync(c => c.AppUserId == appUserId);

            if (coach is null)
                return ApiResponse<IEnumerable<JoinRequestDto>>.Fail("Coach profile not found.");

            var teamIds = await _context.Teams
                .Where(t => t.CoachId == coach.Id)
                .Select(t => t.Id)
                .ToListAsync();

            var activityIds = await _context.Activities
                .Where(a => a.CoachId == coach.Id)
                .Select(a => a.Id)
                .ToListAsync();

            var requests = await _context.JoinRequests
                .Where(j => j.TeamId.HasValue && teamIds.Contains(j.TeamId.Value)
                    || j.ActivityId.HasValue && activityIds.Contains(j.ActivityId.Value))
                .Include(j => j.Member).ThenInclude(m => m.AppUser).ThenInclude(u => u.UserProfile)
                .Include(j => j.Team)
                .Include(j => j.Activity)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return ApiResponse<IEnumerable<JoinRequestDto>>.Ok(
                _mapper.Map<IEnumerable<JoinRequestDto>>(requests));
        }

        public async Task<ApiResponse<IEnumerable<JoinRequestDto>>> GetAllJoinRequestsAsync()
        {
            var requests = await _context.JoinRequests
                .Include(j => j.Member).ThenInclude(m => m.AppUser).ThenInclude(u => u.UserProfile)
                .Include(j => j.Team)
                .Include(j => j.Activity)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return ApiResponse<IEnumerable<JoinRequestDto>>.Ok(
                _mapper.Map<IEnumerable<JoinRequestDto>>(requests));
        }

        public async Task<ApiResponse<PagedResult<JoinRequestDto>>> GetAllJoinRequestsPagedAsync(int page, int pageSize, string? search = null)
        {
            var query = _context.JoinRequests
                .Include(j => j.Member).ThenInclude(m => m.AppUser).ThenInclude(u => u.UserProfile)
                .Include(j => j.Team)
                .Include(j => j.Activity)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(j => j.Member.AppUser.UserName!.Contains(search));

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(j => j.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return ApiResponse<PagedResult<JoinRequestDto>>.Ok(
                new PagedResult<JoinRequestDto>
                {
                    Items = _mapper.Map<List<JoinRequestDto>>(items),
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                },
                "Join requests retrieved successfully");
        }

        public async Task<ApiResponse<JoinRequestDto>> RespondToJoinRequestAsync(int id, RespondJoinRequestDto dto, string appUserId, IList<string> roles)
        {
            var joinRequest = await _context.JoinRequests
                .Include(j => j.Member).ThenInclude(m => m.AppUser).ThenInclude(u => u.UserProfile)
                .Include(j => j.Team)
                .Include(j => j.Activity)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (joinRequest is null)
                return ApiResponse<JoinRequestDto>.Fail("Join request not found.");

            if (joinRequest.Status != JoinRequestStatus.Pending)
                return ApiResponse<JoinRequestDto>.Fail("This request has already been responded to.");

            if (!roles.Contains("Admin"))
            {
                var coach = await _context.Coaches
                    .FirstOrDefaultAsync(c => c.AppUserId == appUserId);

                if (coach is null)
                    return ApiResponse<JoinRequestDto>.Fail("Only coaches and admins can respond to join requests.");

                bool isAuthorized = false;

                if (joinRequest.TeamId.HasValue)
                {
                    var teamCoachId = await _context.Teams
                        .Where(t => t.Id == joinRequest.TeamId)
                        .Select(t => t.CoachId)
                        .FirstOrDefaultAsync();
                    if (teamCoachId == coach.Id) isAuthorized = true;
                }

                if (!isAuthorized && joinRequest.ActivityId.HasValue)
                {
                    var activityCoachId = await _context.Activities
                        .Where(a => a.Id == joinRequest.ActivityId)
                        .Select(a => a.CoachId)
                        .FirstOrDefaultAsync();
                    if (activityCoachId == coach.Id) isAuthorized = true;
                }

                if (!isAuthorized)
                    return ApiResponse<JoinRequestDto>.Fail("You are not authorized to respond to this request.");
            }

            if (!Enum.TryParse<JoinRequestStatus>(dto.Status, true, out var newStatus))
                return ApiResponse<JoinRequestDto>.Fail("Invalid status. Use 'Approved' or 'Rejected'.");

            joinRequest.Status = newStatus;
            joinRequest.RespondedAt = DateTime.UtcNow;
            joinRequest.ResponseNote = dto.Note;

            if (newStatus == JoinRequestStatus.Approved)
            {
                if (joinRequest.TeamId.HasValue)
                {
                    var member = await _context.Members
                        .FirstOrDefaultAsync(m => m.Id == joinRequest.MemberId);
                    if (member is not null)
                    {
                        member.TeamId = joinRequest.TeamId;
                    }
                }

                if (joinRequest.ActivityId.HasValue)
                {
                    var exists = await _context.MemberActivities
                        .AnyAsync(ma => ma.MemberId == joinRequest.MemberId
                            && ma.ActivityId == joinRequest.ActivityId.Value);
                    if (!exists)
                    {
                        _context.MemberActivities.Add(new MemberActivity
                        {
                            MemberId = joinRequest.MemberId,
                            ActivityId = joinRequest.ActivityId.Value,
                        });
                    }
                }
            }

            _unitOfWork.JoinRequests.Update(joinRequest);
            await _unitOfWork.CompleteAsync();

            var targetName = joinRequest.Team?.Name ?? joinRequest.Activity?.Name ?? "team";
            var isApproved = newStatus == JoinRequestStatus.Approved;
            _ = _notificationService.NotifyUserAsync(
                joinRequest.Member.AppUserId,
                isApproved ? "Request Approved" : "Request Rejected",
                $"Your request to join {targetName} has been {(isApproved ? "approved" : "not approved")}.");

            return ApiResponse<JoinRequestDto>.Ok(
                _mapper.Map<JoinRequestDto>(joinRequest),
                $"Join request {dto.Status.ToLower()}.");
        }
    }
}
