namespace Club.Core.Dtos.Team
{
    public class TeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Type { get; set; } = default!;
        public DateTime CreatedAt { get; set; }

        // Coach info
        public int? CoachId { get; set; }
        public string? CoachName { get; set; }
        public string? CoachSpecialization { get; set; }

        // Stats
        public int MembersCount { get; set; }
    }
}
