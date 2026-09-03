using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Controllers;

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