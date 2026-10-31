using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Member
{
    public class CreateMemberDto
    {
        // ─── AppUser data ─────────────────────────────────────────
        [Required]
        [EmailAddress]
        public string Email { get; set; } = default!;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = default!;

        public string? UserName { get; set; } = default!;

        [Phone]
        public string? PhoneNumber { get; set; }

        // ─── UserProfile data ─────────────────────────────────────
        public string? FullName { get; set; }
        public string? Address { get; set; }

        // ─── Member data ──────────────────────────────────────────
        public int? TeamId { get; set; }
    }
}
