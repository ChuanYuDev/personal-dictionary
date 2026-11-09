using System.Reflection;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Controllers;

[Route("api/version")]
[ApiController]
public class VersionController: ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var version = typeof(Program).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;

        return Ok(new { version });
    }
}