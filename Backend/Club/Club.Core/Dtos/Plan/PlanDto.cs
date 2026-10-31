namespace Club.Core.Dtos.Plan
{
    public class PlanDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Type { get; set; } = default!;
        public decimal Price { get; set; }
        public int DurationMonths { get; set; }
        public bool IsActive { get; set; }

        public int SubscriptionsCount { get; set; }
    }
}