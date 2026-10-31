namespace Club.Core.Dtos.Coach
{
    public class CoachDto
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

        // ─── From Coach ───────────────────────────────────────────
        public string Specialization { get; set; } = default!;
        public string? Bio { get; set; }
        public DateTime HireDate { get; set; }
    }
}
