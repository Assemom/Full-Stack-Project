using Club.Core.Enums;

namespace Club.Core.Dtos.Subscription
{
    public class SubscriptionDto
    {
        public int Id { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public SubscriptionStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        public decimal AmountPaid { get; set; }

        // Member info
        public int MemberId { get; set; }
        public string? MemberName { get; set; }

        // Plan info
        public int PlanId { get; set; }
        public string PlanName { get; set; } = default!;
        public string PlanType { get; set; } = default!;
        public decimal PlanPrice { get; set; }
        public int DurationMonths { get; set; }
    }
}