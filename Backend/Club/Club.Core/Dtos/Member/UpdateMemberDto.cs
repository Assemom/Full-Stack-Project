namespace Club.Core.Dtos.Member
{
    public class UpdateMemberDto
    {
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public int? TeamId { get; set; }
    }
}
