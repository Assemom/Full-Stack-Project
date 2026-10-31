using System.ComponentModel.DataAnnotations;

namespace Club.Core.Entities
{
    public class Member
    {
        [Key]
        public int Id { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        // ─── FK → AppUser ────────────────────────────────────────
        [Required]
        public string AppUserId { get; set; } = default!;
        public AppUser AppUser { get; set; } = default!;

        // ─── FK → Team (nullable — member may not be in a team yet) ──
        public int? TeamId { get; set; }
        public Team? Team { get; set; }

        // ─── Navigation (one-to-many) ─────────────────────────────
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<JoinRequest> JoinRequests { get; set; } = new List<JoinRequest>();
    }
}
