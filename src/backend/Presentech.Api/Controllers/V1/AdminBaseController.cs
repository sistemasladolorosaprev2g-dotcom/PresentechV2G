using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Presentech.Business.Exceptions;

namespace Presentech.Api.Controllers.V1;

public abstract class AdminBaseController : ControllerBase
{
    protected int IdAdmin =>
        int.TryParse(User.FindFirstValue("id_admin"), out var id) && id > 0
            ? id
            : throw new UnauthorizedBusinessException("Token inválido: no contiene id_admin.");
}
