using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Booking;
using Club.Core.Entities;
using Club.Core.Enums;
using Club.Repository.Interface;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper, INotificationService notificationService)
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

        private async Task<int?> GetCoachIdByAppUserIdAsync(string appUserId)
        {
            var coaches = await _unitOfWork.Coaches.GetAllAsync();
            return coaches.FirstOrDefault(c => c.AppUserId == appUserId)?.Id;
        }

        // ─── Create ───────────────────────────────────────────────
        public async Task<ApiResponse<BookingDto>> CreateBookingAsync(
            CreateBookingDto dto,
            string? appUserId,
            bool isMember)
        {
            if (isMember)
            {
                if (string.IsNullOrWhiteSpace(appUserId))
                    return ApiResponse<BookingDto>.Fail("You must be logged in to make a booking.");

                var memberId = await GetMemberIdByAppUserIdAsync(appUserId);
                if (memberId is null)
                    return ApiResponse<BookingDto>.Fail("Member profile not found. Please complete your profile before booking.");

                dto.MemberId = memberId.Value;
            }

            if (!await _unitOfWork.Members.ExistsAsync(dto.MemberId))
                return ApiResponse<BookingDto>.Fail("Member profile not found. Please complete your profile before booking.");

            var pitch = await _unitOfWork.Pitches.GetByIdAsync(dto.PitchId);
            if (pitch is null)
                return ApiResponse<BookingDto>.Fail("The selected pitch could not be found. Please choose a different pitch.");

            if (dto.CoachId.HasValue && !await _unitOfWork.Coaches.ExistsAsync(dto.CoachId.Value))
                return ApiResponse<BookingDto>.Fail("The selected coach could not be found. Please choose a different coach.");

            if (dto.EndTime <= dto.StartTime)
                return ApiResponse<BookingDto>.Fail("End time must be after the start time.");

            var date = dto.Date.Date;
            var start = dto.StartTime;
            var end = dto.EndTime;

            var existing = await _unitOfWork.Bookings.GetAllAsync();
            var overlaps = existing.Any(b =>
                b.PitchId == dto.PitchId &&
                b.Date.Date == date &&
                b.Status != BookingStatus.Cancelled &&
                start < b.EndTime &&
                end > b.StartTime);

            if (overlaps)
                return ApiResponse<BookingDto>.Fail("Pitch is already booked for this time");

            var booking = _mapper.Map<Booking>(dto);
            booking.Date = date;
            booking.Status = dto.Status ?? BookingStatus.Pending;

            var hours = (decimal)(end - start).TotalHours;
            booking.TotalPrice = pitch.PricePerHour * hours;

            await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.CompleteAsync();

            var created = await _unitOfWork.Bookings.GetByIdWithIncludesAsync(
                booking.Id,
                b => b.Member,
                b => b.Member.AppUser,
                b => b.Member.AppUser.UserProfile!,
                b => b.Pitch,
                b => b.Coach,
                b => b.Coach!.AppUser,
                b => b.Coach!.AppUser.UserProfile!);

            var bookingDto = _mapper.Map<BookingDto>(created ?? booking);
            var entity = created ?? booking;
            _ = _notificationService.NotifyUserAsync(
                entity.Member.AppUserId,
                "Booking Confirmed",
                $"Your booking at pitch #{entity.Pitch?.Number} on {entity.Date:d} at {entity.StartTime} is confirmed.");

            return ApiResponse<BookingDto>.Ok(
                bookingDto,
                "Booking created successfully");
        }

        // ─── Get All ──────────────────────────────────────────────
        public async Task<ApiResponse<IEnumerable<BookingDto>>> GetAllBookingsAsync()
        {
            var bookings = await _unitOfWork.Bookings.GetAllWithIncludesAsync(
                b => b.Member,
                b => b.Member.AppUser,
                b => b.Member.AppUser.UserProfile!,
                b => b.Pitch,
                b => b.Coach,
                b => b.Coach!.AppUser,
                b => b.Coach!.AppUser.UserProfile!);

            return ApiResponse<IEnumerable<BookingDto>>.Ok(
                _mapper.Map<IEnumerable<BookingDto>>(bookings),
                "Bookings retrieved successfully");
        }

        public async Task<ApiResponse<PagedResult<BookingDto>>> GetAllBookingsPagedAsync(int page, int pageSize, string? search = null)
        {
            var paged = await _unitOfWork.Bookings.GetAllPagedAsync(page, pageSize,
                includes: [b => b.Member, b => b.Member.AppUser, b => b.Member.AppUser.UserProfile!,
                           b => b.Pitch, b => b.Coach, b => b.Coach!.AppUser, b => b.Coach!.AppUser.UserProfile!]);

            return ApiResponse<PagedResult<BookingDto>>.Ok(
                new PagedResult<BookingDto>
                {
                    Items = _mapper.Map<List<BookingDto>>(paged.Items),
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                },
                "Bookings retrieved successfully");
        }

        public async Task<ApiResponse<IEnumerable<BookingDto>>> GetTodayBookingsAsync(DateTime dateUtc)
        {
            var bookings = await _unitOfWork.Bookings.GetAllWithIncludesAsync(
                b => b.Member,
                b => b.Member.AppUser,
                b => b.Member.AppUser.UserProfile!,
                b => b.Pitch,
                b => b.Coach,
                b => b.Coach!.AppUser,
                b => b.Coach!.AppUser.UserProfile!);

            var today = dateUtc.Date;
            var todayBookings = bookings.Where(b => b.Date.Date == today);

            return ApiResponse<IEnumerable<BookingDto>>.Ok(
                _mapper.Map<IEnumerable<BookingDto>>(todayBookings),
                "Bookings retrieved successfully");
        }

        public async Task<ApiResponse<IEnumerable<BookingDto>>> GetMemberBookingsAsync(string appUserId)
        {
            var memberId = await GetMemberIdByAppUserIdAsync(appUserId);
            if (memberId is null)
                return ApiResponse<IEnumerable<BookingDto>>.Fail("Member profile not found. Please log in again.");

            var bookings = await _unitOfWork.Bookings.GetAllWithIncludesAsync(
                b => b.Member,
                b => b.Member.AppUser,
                b => b.Member.AppUser.UserProfile!,
                b => b.Pitch,
                b => b.Coach,
                b => b.Coach!.AppUser,
                b => b.Coach!.AppUser.UserProfile!);

            var memberBookings = bookings.Where(b => b.MemberId == memberId.Value);

            return ApiResponse<IEnumerable<BookingDto>>.Ok(
                _mapper.Map<IEnumerable<BookingDto>>(memberBookings),
                "Bookings retrieved successfully");
        }

        public async Task<ApiResponse<IEnumerable<BookingDto>>> GetCoachBookingsAsync(string appUserId)
        {
            var coachId = await GetCoachIdByAppUserIdAsync(appUserId);
            if (coachId is null)
                return ApiResponse<IEnumerable<BookingDto>>.Fail("Coach profile not found. Please log in again.");

            var bookings = await _unitOfWork.Bookings.GetAllWithIncludesAsync(
                b => b.Member,
                b => b.Member.AppUser,
                b => b.Member.AppUser.UserProfile!,
                b => b.Pitch,
                b => b.Coach,
                b => b.Coach!.AppUser,
                b => b.Coach!.AppUser.UserProfile!);

            var coachBookings = bookings.Where(b => b.CoachId == coachId.Value);

            return ApiResponse<IEnumerable<BookingDto>>.Ok(
                _mapper.Map<IEnumerable<BookingDto>>(coachBookings),
                "Bookings retrieved successfully");
        }

        // ─── Get By Id ────────────────────────────────────────────
        public async Task<ApiResponse<BookingDto>> GetBookingByIdAsync(int id)
        {
            var booking = await _unitOfWork.Bookings.GetByIdWithIncludesAsync(
                id,
                b => b.Member,
                b => b.Member.AppUser,
                b => b.Member.AppUser.UserProfile!,
                b => b.Pitch,
                b => b.Coach,
                b => b.Coach!.AppUser,
                b => b.Coach!.AppUser.UserProfile!);

            if (booking is null)
                return ApiResponse<BookingDto>.Fail("The booking could not be found. It may have been cancelled.");

            return ApiResponse<BookingDto>.Ok(
                _mapper.Map<BookingDto>(booking),
                "Booking retrieved successfully");
        }

        // ─── Update ───────────────────────────────────────────────
        public async Task<ApiResponse<BookingDto>> UpdateBookingAsync(
            int id,
            UpdateBookingDto dto,
            string? appUserId,
            bool isMember)
        {
            var booking = await _unitOfWork.Bookings.GetByIdWithIncludesAsync(
                id,
                b => b.Member,
                b => b.Member.AppUser,
                b => b.Member.AppUser.UserProfile!,
                b => b.Pitch,
                b => b.Coach,
                b => b.Coach!.AppUser,
                b => b.Coach!.AppUser.UserProfile!);

            if (booking is null)
                return ApiResponse<BookingDto>.Fail("The booking could not be found. It may have been cancelled.");

            if (isMember)
            {
                if (string.IsNullOrWhiteSpace(appUserId))
                    return ApiResponse<BookingDto>.Fail("You must be logged in to update a booking.");

                if (booking.Member.AppUserId != appUserId)
                    return ApiResponse<BookingDto>.Fail("You can only edit your own bookings.");

                dto.MemberId = null;
            }

            if (dto.MemberId.HasValue && !await _unitOfWork.Members.ExistsAsync(dto.MemberId.Value))
                return ApiResponse<BookingDto>.Fail("Member profile not found.");

            Pitch pitchForPrice = booking.Pitch;
            if (dto.PitchId.HasValue)
            {
                pitchForPrice = await _unitOfWork.Pitches.GetByIdAsync(dto.PitchId.Value);
                if (pitchForPrice is null)
                    return ApiResponse<BookingDto>.Fail("The selected pitch could not be found.");
            }

            if (dto.CoachId.HasValue && !await _unitOfWork.Coaches.ExistsAsync(dto.CoachId.Value))
                return ApiResponse<BookingDto>.Fail("The selected coach could not be found.");

            var date = (dto.Date ?? booking.Date).Date;
            var start = dto.StartTime ?? booking.StartTime;
            var end = dto.EndTime ?? booking.EndTime;

            if (end <= start)
                return ApiResponse<BookingDto>.Fail("End time must be after the start time.");

            var pitchId = dto.PitchId ?? booking.PitchId;

            var existing = await _unitOfWork.Bookings.GetAllAsync();
            var overlaps = existing.Any(b =>
                b.Id != booking.Id &&
                b.PitchId == pitchId &&
                b.Date.Date == date &&
                b.Status != BookingStatus.Cancelled &&
                start < b.EndTime &&
                end > b.StartTime);

            if (overlaps)
                return ApiResponse<BookingDto>.Fail("This pitch is already booked during the selected time. Please choose a different time or pitch.");

            _mapper.Map(dto, booking);
            booking.Date = date;
            booking.StartTime = start;
            booking.EndTime = end;

            var hours = (decimal)(end - start).TotalHours;
            booking.TotalPrice = pitchForPrice.PricePerHour * hours;

            _unitOfWork.Bookings.Update(booking);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<BookingDto>.Ok(
                _mapper.Map<BookingDto>(booking),
                "Booking updated successfully");
        }

        public async Task<ApiResponse<bool>> DeleteBookingAsync(
    int id,
    string? appUserId,
    string role)
        {
            var booking = await _unitOfWork.Bookings.GetByIdWithIncludesAsync(
                id,
                b => b.Member,
                b => b.Member.AppUser,
                b => b.Pitch,
                b => b.Coach,
                b => b.Coach!.AppUser);

            if (booking is null)
                return ApiResponse<bool>.Fail("The booking could not be found. It may have been cancelled.");

            var bookingStart = booking.Date.Date + booking.StartTime;

            if (DateTime.UtcNow >= bookingStart)
                return ApiResponse<bool>.Fail("You can only cancel bookings that haven't started yet.");

            switch (role)
            {
                case "Admin":
                    break;

                case "Member":
                    if (string.IsNullOrWhiteSpace(appUserId) ||
                        booking.Member.AppUserId != appUserId)
                    {
                        return ApiResponse<bool>.Fail(
                            "You can only cancel your own bookings.");
                    }
                    break;

                case "Coach":
                    if (string.IsNullOrWhiteSpace(appUserId) ||
                        booking.Coach is null ||
                        booking.Coach.AppUserId != appUserId)
                    {
                        return ApiResponse<bool>.Fail(
                            "You can only cancel your own bookings.");
                    }
                    break;

                default:
                    return ApiResponse<bool>.Fail("You don't have permission to cancel this booking.");
            }

            _unitOfWork.Bookings.Delete(booking);

            await _unitOfWork.CompleteAsync();

            _ = _notificationService.NotifyUserAsync(
                booking.Member.AppUserId,
                "Booking Cancelled",
                $"Your booking at {booking.Pitch?.Number} on {booking.Date:d} has been cancelled.");

            return ApiResponse<bool>.Ok(
                true,
                "Booking deleted successfully");
        }
    }
}