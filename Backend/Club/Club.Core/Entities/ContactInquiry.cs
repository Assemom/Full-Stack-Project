using System.ComponentModel.DataAnnotations;

namespace Club.Core.Entities
{
    public class ContactInquiry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;

        [Required]
        [MaxLength(200)]
        [EmailAddress]
        public string Email { get; set; } = default!;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Message { get; set; } = default!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}