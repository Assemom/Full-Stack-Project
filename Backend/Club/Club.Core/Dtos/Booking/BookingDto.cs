using Club.Core.Enums;

namespace Club.Core.Dtos.Booking
{
    public class BookingDto
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public BookingStatus Status { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }

        // Member info
        public int MemberId { get; set; }
        public string? MemberName { get; set; }

        // Pitch info
        public int PitchId { get; set; }
        public int PitchNumber { get; set; }
        public string PitchType { get; set; } = default!;
        public decimal PricePerHour { get; set; }

        // Coach info (optional)
        public int? CoachId { get; set; }
        public string? CoachName { get; set; }
    }
}