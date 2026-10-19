using Application.Abstractions;
using Application.Dtos;
using Application.Services;
using DictionaryApi.Extensions;
using DictionaryApi.Filters;
using DictionaryApi.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Controllers;

[Route("api/entries")]
[ApiController]
[ServiceFilter<ValidateDbIdActionFilter>]
public class EntriesController: ControllerBase
{
    private readonly IEntryRepository _entryRepository;
    private const string GetByIdName = "GetEntryById";
    
    public EntriesController(IEntryRepository entryRepository)
    {
        _entryRepository = entryRepository;
    }

    [HttpGet]
    public async Task<List<EntryDto>> GetAsync([FromQuery] PaginationDto paginationDto)
    {
        var totalCount = await _entryRepository.CountAsync();
        HttpContext.AppendTotalCountInHeader(totalCount);

        return await _entryRepository.GetAsync(paginationDto);
    }

    [HttpGet("{id:int}", Name = GetByIdName)]
    public async Task<ActionResult<EntryDto>> GetAsync(int id)
    {
        return Ok();
    }

    [HttpPost]
    public async Task<CreatedAtRouteResult> CreateAsync([FromBody] EntryCreationDto entryCreationDto)
    {
        var entryDto = await _entryRepository.CreateAsync(entryCreationDto);
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