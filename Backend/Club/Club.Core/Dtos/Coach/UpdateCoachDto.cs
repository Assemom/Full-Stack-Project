namespace Club.Core.Dtos.Coach
{
    public class UpdateCoachDto
    {
        //all nullable (update only what is sent)
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Specialization { get; set; }
        public string? Bio { get; set; }

    }
}
