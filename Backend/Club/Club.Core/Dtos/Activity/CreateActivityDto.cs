using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Activity
{
    public class CreateActivityDto
    {
        [Required]
        public string Name { get; set; } = default!;

        public string? Description { get; set; }

        [Required]
        public string Schedule { get; set; } = default!;

        [Range(1, int.MaxValue)]
        public int MaxCapacity { get; set; }

        public bool? IsActive { get; set; }

        [Required]
        public int CoachId { get; set; }

        [Required]
        public int TeamId { get; set; }
    }
}