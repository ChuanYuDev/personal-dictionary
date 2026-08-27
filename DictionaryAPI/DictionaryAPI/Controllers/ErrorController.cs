using Microsoft.AspNetCore.Mvc;

namespace DictionaryAPI.Controllers;

public class ErrorController: ControllerBase
{
    [Route("/api/error")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult HandlerError()
    {
        return Problem(
            statusCode: StatusCodes.Status500InternalServerError,
            title: "An unexpected error occurred."
        );
    }
}