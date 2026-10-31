namespace Club.Core.Dtos.Activity
{
    public class ActivityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string Schedule { get; set; } = default!;
        public int MaxCapacity { get; set; }
        public bool IsActive { get; set; }

        public int CoachId { get; set; }
        public string? CoachName { get; set; }

        public int TeamId { get; set; }
        public string? TeamName { get; set; }
        public int TeamMembersCount { get; set; }
    }
}