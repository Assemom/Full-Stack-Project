using Club.Core.Dtos.Pitch;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/admin/pitches")]
    public class PitchController : ControllerBase
    {
        private readonly IPitchService _pitchService;

        public PitchController(IPitchService pitchService)
        {
            _pitchService = pitchService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreatePitch([FromBody] CreatePitchDto dto)
        {
            var response = await _pitchService.CreatePitchAsync(dto);
            return response.Success ? StatusCode(201, response) : BadRequest(response);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllPitches(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            if (page > 0)
            {
                var paged = await _pitchService.GetAllPitchesPagedAsync(page, pageSize, search);
                return paged.Success ? Ok(paged) : BadRequest(paged);
            }
            var response = await _pitchService.GetAllPitchesAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPitchById(int id)
        {
            var response = await _pitchService.GetPitchByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePitch(int id, [FromBody] UpdatePitchDto dto)
        {
            var response = await _pitchService.UpdatePitchAsync(id, dto);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePitch(int id)
        {
            var response = await _pitchService.DeletePitchAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }
    }
}