using System.ComponentModel.DataAnnotations;

namespace Club.Core.Entities
{
    public class Activity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = default!;
        // e.g. "Football Training", "Swimming Class", "Padel Session"

        public string? Description { get; set; }

        public string Schedule { get; set; } = default!;
        // e.g. "Mon/Wed 6:00 PM" — simple string for now

        public int MaxCapacity { get; set; }
        // max number of members allowed in this activity

        public bool IsActive { get; set; } = true;
        // admin/coach can deactivate without deleting

        // ─── FK → Coach ───────────────────────────────────────────
        [Required]
        public int CoachId { get; set; }
        public Coach Coach { get; set; } = default!;

        // ─── FK → Team ────────────────────────────────────────────
        [Required]
        public int TeamId { get; set; }
        public Team Team { get; set; } = default!;
    }
}
