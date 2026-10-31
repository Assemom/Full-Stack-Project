using System.Security.Claims;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/upload")]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;

        public UploadController(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost("profile-image")]
        public async Task<IActionResult> UploadProfileImage(IFormFile file)
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(appUserId))
                return Unauthorized();

            if (file is null || file.Length == 0)
                return BadRequest(Club.Core.Dtos.ApiResponse<string>.Fail("No file provided."));

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);

            var response = await _fileUploadService.UploadProfileImageAsync(
                ms.ToArray(), file.FileName, appUserId);

            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}