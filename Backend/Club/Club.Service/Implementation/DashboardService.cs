using Club.Core.Dtos;
using Club.Core.Dtos.Dashboard;
using Club.Core.Entities;
using Club.Core.Enums;
using Club.Repository.Interface;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<AdminDashboardDto>> GetAdminDashboardAsync()
        {
            var members = await _unitOfWork.Members.GetAllAsync();
            var subscriptions = await _unitOfWork.Subscriptions.GetAllAsync();
            var bookings = await _unitOfWork.Bookings.GetAllAsync();
            var pitches = await _unitOfWork.Pitches.GetAllAsync();
            var coaches = await _unitOfWork.Coaches.GetAllAsync();
            var teams = await _unitOfWork.Teams.GetAllAsync();
            var activities = await _unitOfWork.Activities.GetAllAsync();

            var today = DateTime.UtcNow.Date;

            var dto = new AdminDashboardDto
            {
                TotalMembers = members.Count(),
                ActiveSubscriptions = subscriptions.Count(s => s.Status == SubscriptionStatus.Active),
                TodayBookings = bookings.Count(b => b.Date.Date == today && b.Status != BookingStatus.Cancelled),
                AvailablePitches = pitches.Count(p => p.IsAvailable),
                TotalCoaches = coaches.Count(),
                TotalTeams = teams.Count(),
                TotalActivities = activities.Count(),
                Revenue = subscriptions
                    .Where(s => s.Status == SubscriptionStatus.Active)
                    .Sum(s => s.AmountPaid),
            };

            return ApiResponse<AdminDashboardDto>.Ok(dto, "Dashboard stats retrieved successfully");
        }

        public async Task<ApiResponse<MemberDashboardDto>> GetMemberDashboardAsync(string appUserId)
        {
            var allMembers = await _unitOfWork.Members.GetAllAsync();
            var member = allMembers.FirstOrDefault(m => m.AppUserId == appUserId);

            if (member is null)
                return ApiResponse<MemberDashboardDto>.Fail("Member profile not found. If you recently registered, try logging out and back in.");

            var memberId = member.Id;
            var bookings = await _unitOfWork.Bookings.GetAllAsync();
            var subscriptions = await _unitOfWork.Subscriptions.GetAllAsync();
            var activities = await _unitOfWork.Activities.GetAllAsync();
            var pitches = await _unitOfWork.Pitches.GetAllAsync();

            var dto = new MemberDashboardDto
            {
                MyBookings = bookings.Count(b =>
                    b.MemberId == memberId && b.Status != BookingStatus.Cancelled),
                MySubscriptions = subscriptions.Count(s => s.MemberId == memberId),
                TotalActivities = activities.Count(a => a.IsActive),
                AvailablePitches = pitches.Count(p => p.IsAvailable),
            };

            return ApiResponse<MemberDashboardDto>.Ok(dto, "Dashboard stats retrieved successfully");
        }

        public async Task<ApiResponse<CoachDashboardDto>> GetCoachDashboardAsync(string appUserId)
        {
            var allCoaches = await _unitOfWork.Coaches.GetAllAsync();
            var coach = allCoaches.FirstOrDefault(c => c.AppUserId == appUserId);

            if (coach is null)
                return ApiResponse<CoachDashboardDto>.Fail("Coach profile not found. Please log in again.");

            var coachId = coach.Id;
            var activities = await _unitOfWork.Activities.GetAllAsync();
            var bookings = await _unitOfWork.Bookings.GetAllAsync();
            var teams = await _unitOfWork.Teams.GetAllAsync();

            var dto = new CoachDashboardDto
            {
                MyActivities = activities.Count(a => a.CoachId == coachId && a.IsActive),
                MyBookings = bookings.Count(b =>
                    b.CoachId == coachId && b.Status != BookingStatus.Cancelled),
                MyTeams = teams.Count(t => t.CoachId == coachId),
            };

            return ApiResponse<CoachDashboardDto>.Ok(dto, "Dashboard stats retrieved successfully");
        }
    }
}
