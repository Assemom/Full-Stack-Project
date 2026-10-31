using Club.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Booking
{
    public class CreateBookingDto
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public int MemberId { get; set; }

        [Required]
        public int PitchId { get; set; }

        public int? CoachId { get; set; }

        public BookingStatus? Status { get; set; }
    }
}