using Club.Core.Dtos;
using Club.Core.Dtos.Contact;

namespace Club.Service.Interface
{
    public interface IContactService
    {
        Task<ApiResponse<string>> SubmitInquiryAsync(CreateContactInquiryDto dto);
    }
}