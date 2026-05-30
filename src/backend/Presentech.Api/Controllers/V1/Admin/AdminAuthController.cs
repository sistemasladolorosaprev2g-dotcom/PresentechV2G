using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Presentech.Api.Controllers.V1;
using Presentech.Api.Models.Common;
using Presentech.Business.DTOs.Admin;
using Presentech.Business.Interfaces;

namespace Presentech.Api.Controllers.V1.Admin;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/auth")]
public class AdminAuthController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminAuthController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    /// <summary>Autenticación del administrador (vicerectorado).</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginAdminResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginAdminRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.LoginAsync(request, cancellationToken);
        return Ok(ApiResponse<LoginAdminResponse>.Ok(result, "Autenticación exitosa."));
    }

    /// <summary>Registrar un nuevo administrador (vicerectorado).</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<RegisterAdminResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterAdminRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _adminService.RegisterAdminAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<RegisterAdminResponse>.Ok(result, "Administrador registrado exitosamente."));
    }
}
