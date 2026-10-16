using Application.Dtos;
using Application.Services;
using DictionaryApi.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Controllers;

[Route("api/entries")]
[ApiController]
public class EntriesController: ControllerBase
{
    private readonly EntryService _entryService;
    private readonly IDictionaryContext _dictionaryContext;
    private const string GetByIdName = "GetEntryById";
    
    public EntriesController(EntryService entryService, IDictionaryContext dictionaryContext)
    {
        _entryService = entryService;
        _dictionaryContext = dictionaryContext;
    }

    [HttpGet("{id:int}", Name = GetByIdName)]
    public async Task<ActionResult<EntryDto>> GetAsync(int id)
    {
        return Ok();
    }

    [HttpPost]
    public async Task<CreatedAtRouteResult> CreateAsync([FromBody] EntryCreationDto entryCreationDto)
    {
        var entryDto = await _entryService.CreateAsync(entryCreationDto);
        return CreatedAtRoute(GetByIdName, new { id = entryDto.Id }, entryDto);
    }

    // [HttpPut("{id:int}")]
    // public async Task<IActionResult> UpdateAsync(int id, [FromBody] EntryCreationDto entryCreationDto)
    // {
    //     
    // }
    //
    // [HttpDelete("{id:int}")]
    // public async Task<IActionResult> DeleteAsync(int id)
    // {
    //     
    // }
}