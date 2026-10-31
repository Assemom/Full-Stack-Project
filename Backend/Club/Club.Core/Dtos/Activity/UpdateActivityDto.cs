namespace Club.Core.Dtos.Activity
{
    public class UpdateActivityDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Schedule { get; set; }
        public int? MaxCapacity { get; set; }
        public bool? IsActive { get; set; }
        public int? CoachId { get; set; }
        public int? TeamId { get; set; }
    }
}