using Club.Core.Enums;

namespace Club.Core.Dtos.Subscription
{
    public class UpdateSubscriptionDto
    {
        public int? MemberId { get; set; }
        public int? PlanId { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? AmountPaid { get; set; }
        public SubscriptionStatus? Status { get; set; }
        public PaymentStatus? PaymentStatus { get; set; }
    }
}