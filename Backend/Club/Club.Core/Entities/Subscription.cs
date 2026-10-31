using Club.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Club.Core.Entities
{
    public class Subscription
    {
        [Key]
        public int Id { get; set; }

        public DateTime StartDate { get; set; } = DateTime.UtcNow;

        public DateTime EndDate { get; set; }

        public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Pending;
        // Pending | Active | Inactive | Expired

        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        // Paid | Pending

        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; set; }
        // snapshot of plan price at time of subscription
        // (in case plan price changes later, history is preserved)

        // ─── FK → Member ──────────────────────────────────────────
        [Required]
        public int MemberId { get; set; }
        public Member Member { get; set; } = default!;

        // ─── FK → Plan ────────────────────────────────────────────
        [Required]
        public int PlanId { get; set; }
        public Plan Plan { get; set; } = default!;
    }
}
