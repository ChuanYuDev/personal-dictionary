using Microsoft.AspNetCore.Mvc;

namespace DictionaryAPI.Controllers;

public class ErrorController: ControllerBase
{
    [Route("/error")]
    public IActionResult HandlerError()
    {
        return Problem(
            statusCode: StatusCodes.Status500InternalServerError,
            title: "An unexpected error occurred."
        );
    }
}