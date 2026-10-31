using Club.Core.Enums;

namespace Club.Core.Dtos.Booking
{
    public class UpdateBookingDto
    {
        public DateTime? Date { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public int? MemberId { get; set; }
        public int? PitchId { get; set; }
        public int? CoachId { get; set; }
        public BookingStatus? Status { get; set; }
    }
}