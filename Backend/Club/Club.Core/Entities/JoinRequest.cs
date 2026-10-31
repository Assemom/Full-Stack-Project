using System.ComponentModel.DataAnnotations;
using Club.Core.Enums;

namespace Club.Core.Entities
{
    public class JoinRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }
        public Member Member { get; set; } = default!;

        public int? TeamId { get; set; }
        public Team? Team { get; set; }

        public int? ActivityId { get; set; }
        public Activity? Activity { get; set; }

        public JoinRequestStatus Status { get; set; } = JoinRequestStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? RespondedAt { get; set; }

        public string? ResponseNote { get; set; }
    }
}
