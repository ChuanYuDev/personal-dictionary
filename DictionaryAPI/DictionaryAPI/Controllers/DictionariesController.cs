using Application.Services;
using DictionaryAPI.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryAPI.Controllers;

[Route("api/dictionaries")]
[ApiController]
public class DictionariesController: ControllerBase
{
    private readonly DictionaryService _dictionaryService;

    public DictionariesController(DictionaryService dictionaryService)
    {
        _dictionaryService = dictionaryService;
    }
    
    [HttpPost("create")]
    public async Task<CreateDictionaryResponse> Create()
    {
        var dbId = await _dictionaryService.CreateAsync();

        return new CreateDictionaryResponse { DbId = dbId };
    }
}