using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Club.Core.Entities
{
    public class Plan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = default!;
        // e.g. "Monthly Basic", "Yearly Premium"

        [Required]
        public string Type { get; set; } = default!;
        // "Monthly" | "Yearly"

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int DurationMonths { get; set; }
        // Monthly = 1 , Yearly = 12

        public bool IsActive { get; set; } = true;
        // Admin can deactivate a plan without deleting it

        // ─── Navigation (one-to-many) ─────────────────────────────
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    }
}
