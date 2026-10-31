using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.JoinRequests
{
    public class RespondJoinRequestDto
    {
        [Required]
        public string Status { get; set; } = default!;

        public string? Note { get; set; }
    }
}
