using System.ComponentModel.DataAnnotations;

namespace Club.Core.Entities
{
    public class MemberActivity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }
        public Member Member { get; set; } = default!;

        [Required]
        public int ActivityId { get; set; }
        public Activity Activity { get; set; } = default!;

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
