using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Plan
{
    public class CreatePlanDto
    {
        [Required]
        public string Name { get; set; } = default!;
        // e.g. "Monthly Basic", "Yearly Premium"

        [Required]
        public string Type { get; set; } = default!;
        // "Monthly" | "Yearly"

        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(1, 120)]
        public int DurationMonths { get; set; }
        // Monthly = 1 , Yearly = 12

        public bool? IsActive { get; set; }
    }
}