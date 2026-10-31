using System.ComponentModel.DataAnnotations;

namespace Club.Core.Dtos.Contact
{
    public class CreateContactInquiryDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(100)]
        public string Name { get; set; } = default!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = default!;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Message is required")]
        [MaxLength(2000)]
        public string Message { get; set; } = default!;
    }
}