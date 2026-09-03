using Application.Dtos;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Controllers;

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
    public async Task<DictionaryDto> Create()
    {
        return await _dictionaryService.CreateAsync();
    }
}