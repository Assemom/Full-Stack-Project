using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Coach
{
    public class CreateCoachDto
    {
        // ─── AppUser data ─────────────────────────────────────────
        [Required]
        [EmailAddress]
        public string Email { get; set; } = default!;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = default!;

        [Required]
        public string UserName { get; set; } = default!;

        [Phone]
        public string? PhoneNumber { get; set; }

        // ─── UserProfile data ─────────────────────────────────────
        public string? FullName { get; set; }
        public string? Address { get; set; }

        // ─── Coach profile data ───────────────────────────────────
        [Required]
        public string Specialization { get; set; } = default!;
        // "Football" | "Basketball" | "Swimming" | "Padel"

        public string? Bio { get; set; }
    }
}
