using Club.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Subscription
{
    public class CreateSubscriptionDto
    {
        [Required]
        public int MemberId { get; set; }

        [Required]
        public int PlanId { get; set; }

        public DateTime? StartDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? AmountPaid { get; set; }

        public SubscriptionStatus? Status { get; set; }
        public PaymentStatus? PaymentStatus { get; set; }
    }
}