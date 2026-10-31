using Club.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Club.Core.Entities
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }
        // e.g. 14:00:00 (2:00 PM)

        [Required]
        public TimeSpan EndTime { get; set; }
        // e.g. 15:00:00 (3:00 PM)

        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        // Pending | Confirmed | Cancelled

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
        // calculated: PricePerHour × duration in hours

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ─── FK → Member ──────────────────────────────────────────
        [Required]
        public int MemberId { get; set; }
        public Member Member { get; set; } = default!;

        // ─── FK → Pitch ───────────────────────────────────────────
        [Required]
        public int PitchId { get; set; }
        public Pitch Pitch { get; set; } = default!;

        // ─── FK → Coach (optional) ────────────────────────────────
        public int? CoachId { get; set; }
        public Coach? Coach { get; set; }
    }
}
