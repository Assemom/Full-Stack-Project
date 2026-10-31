using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Team
{
    public class CreateTeamDto
    {
        [Required]
        public string Name { get; set; } = default!;

        [Required]
        public string Type { get; set; } = default!;
        // "Football" | "Basketball" | "Swimming" | "Padel"

        public int? CoachId { get; set; }
        // optional — team can be created without a coach
    }
}
