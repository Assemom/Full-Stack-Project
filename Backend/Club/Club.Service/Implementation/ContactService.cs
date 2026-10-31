using Club.Core.Dtos;
using Club.Core.Dtos.Contact;
using Club.Core.Entities;
using Club.Repository.Data.Context;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class ContactService : IContactService
    {
        private readonly ClubContext _context;

        public ContactService(ClubContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<string>> SubmitInquiryAsync(CreateContactInquiryDto dto)
        {
            var inquiry = new ContactInquiry
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.Set<ContactInquiry>().Add(inquiry);
            await _context.SaveChangesAsync();

            return ApiResponse<string>.Ok("Thank you for reaching out! We will get back to you shortly.");
        }
    }
}