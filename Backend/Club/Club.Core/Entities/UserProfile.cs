using System.ComponentModel.DataAnnotations;

namespace Club.Core.Entities
{
    public class UserProfile
    {
        [Key]
        public string AppUserId { get; set; } = default!;

        public string? FullName { get; set; }
        public string? Address { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public AppUser AppUser { get; set; } = default!;
    }
}