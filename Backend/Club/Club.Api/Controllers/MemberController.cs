using Club.Core.Dtos.Member;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Club.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MemberController : ControllerBase
    {
        private readonly IMemberService _memberService;

        public MemberController(IMemberService memberService)
        {
            _memberService = memberService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateMember([FromBody] CreateMemberDto dto)
        {
            var response = await _memberService.CreateMemberAsync(dto);
            return response.Success ? StatusCode(201, response) : BadRequest(response);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllMembers(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            if (page > 0)
            {
                var paged = await _memberService.GetAllMembersPagedAsync(page, pageSize, search);
                return paged.Success ? Ok(paged) : BadRequest(paged);
            }
            var response = await _memberService.GetAllMembersAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMemberById(int id)
        {
            var response = await _memberService.GetMemberByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentMember()
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (appUserId is null)
                return Unauthorized();
            var response = await _memberService.GetMemberByAppUserIdAsync(appUserId);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("/api/member/profile")]
        [Authorize]
        public async Task<IActionResult> UpdateCurrentMember([FromBody] UpdateMemberDto dto)
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (appUserId is null)
                return Unauthorized();
            var response = await _memberService.UpdateMemberByAppUserIdAsync(appUserId, dto);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] UpdateMemberDto dto)
        {
            var response = await _memberService.UpdateMemberAsync(id, dto);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var response = await _memberService.DeleteMemberAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }
    }
}
