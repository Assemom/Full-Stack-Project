using Club.Core.Dtos.Team;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Club.Api.Controllers
{
    [ApiController]
    [Route("api/admin/teams")]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDto dto)
        {
            var response = await _teamService.CreateTeamAsync(dto);
            return response.Success ? StatusCode(201, response) : BadRequest(response);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllTeams(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null)
        {
            if (page > 0)
            {
                var paged = await _teamService.GetAllTeamsPagedAsync(page, pageSize, search);
                return paged.Success ? Ok(paged) : BadRequest(paged);
            }
            var response = await _teamService.GetAllTeamsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTeamById(int id)
        {
            var response = await _teamService.GetTeamByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTeam(int id, [FromBody] UpdateTeamDto dto)
        {
            var response = await _teamService.UpdateTeamAsync(id, dto);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var response = await _teamService.DeleteTeamAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }
    }
}