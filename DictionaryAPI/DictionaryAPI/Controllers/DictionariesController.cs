using Microsoft.AspNetCore.Mvc;

namespace DictionaryAPI.Controllers;

[Route("api/dictionaries")]
[ApiController]
public class DictionariesController: ControllerBase
{
    [HttpPost("create")]
    public async Task Create()
    {
                
    }
}