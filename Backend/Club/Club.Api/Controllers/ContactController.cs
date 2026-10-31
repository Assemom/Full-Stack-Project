using Club.Core.Dtos.Contact;
using Club.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/contact")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitInquiry([FromBody] CreateContactInquiryDto dto)
        {
            var response = await _contactService.SubmitInquiryAsync(dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}