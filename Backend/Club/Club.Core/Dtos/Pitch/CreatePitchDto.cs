using Club.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Pitch
{
    public class CreatePitchDto
    {
        [Required]
        public int Number { get; set; }

        [Required]
        public PitchType Type { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal PricePerHour { get; set; }

        public bool? IsAvailable { get; set; }
        public string? Description { get; set; }
    }
}