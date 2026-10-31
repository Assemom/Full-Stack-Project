namespace Club.Core.Dtos.Plan
{
    public class UpdatePlanDto
    {
        public string? Name { get; set; }
        public string? Type { get; set; }
        public decimal? Price { get; set; }
        public int? DurationMonths { get; set; }
        public bool? IsActive { get; set; }
    }
}