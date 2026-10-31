namespace Club.Core.Dtos.JoinRequests
{
    public class JoinRequestDto
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public string MemberName { get; set; } = default!;
        public string MemberEmail { get; set; } = default!;
        public int? TeamId { get; set; }
        public string? TeamName { get; set; }
        public int? ActivityId { get; set; }
        public string? ActivityName { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public string? ResponseNote { get; set; }
    }
}
