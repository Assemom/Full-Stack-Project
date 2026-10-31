namespace Club.Core.Dtos.Member
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string AppUserId { get; set; } = default!;

        // ─── From AppUser ─────────────────────────────────────────
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? PhoneNumber { get; set; }

        // ─── From UserProfile ─────────────────────────────────────
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public string? ImageUrl { get; set; }

        // ─── From Member ──────────────────────────────────────────
        public int? TeamId { get; set; }
        public string? TeamName { get; set; }
        public string? SubscriptionStatus { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
