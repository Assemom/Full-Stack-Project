using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace Club.Core.Entities
{
    public class Team
    {
        [Key]
        public int Id { get; set; }

        [Required]
        // e.g. "Football Team A", "Swimming Group 1"
        public string Name { get; set; } = default!;

        [Required]
        // "Football" | "Basketball" | "Swimming" | "Padel"
        public string Type { get; set; } = default!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ─── FK → Coach ───────────────────────────────────────────
        public int? CoachId { get; set; }
        public Coach? Coach { get; set; }

        // ─── Navigation (one-to-many) ─────────────────────────────
        public ICollection<Member> Members { get; set; } = new List<Member>();
        public ICollection<Activity> Activities { get; set; } = new List<Activity>();
    }
}
