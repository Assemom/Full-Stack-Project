using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace Club.Core.Entities
{
    public class Coach
    {
        [Key]
        public int Id { get; set; }

        [Required]
        // "Football" | "Basketball" | "Swimming" | "Padel"
        public string Specialization { get; set; } = default!;

        public string? Bio { get; set; }

        public DateTime HireDate { get; set; } = DateTime.UtcNow;

        // ─── FK → AppUser ────────────────────────────────────────
        [Required]
        public string AppUserId { get; set; } = default!;
        public AppUser AppUser { get; set; } = default!;

        // ─── Navigation (one-to-many) ─────────────────────────────
        public ICollection<Team> Teams { get; set; } = new List<Team>();
        public ICollection<Activity> Activities { get; set; } = new List<Activity>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
