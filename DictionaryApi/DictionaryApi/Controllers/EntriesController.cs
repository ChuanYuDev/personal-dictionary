using Application.Abstractions;
using Application.Dtos;
using Application.Services;
using DictionaryApi.Extensions;
using DictionaryApi.Filters;
using DictionaryApi.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace DictionaryApi.Controllers;

[Route("api/entries")]
[ApiController]
[ServiceFilter<ValidateDbIdActionFilter>]
public class EntriesController: ControllerBase
{
    private readonly IEntryRepository _entryRepository;
    private readonly IOutputCacheStore _outputCacheStore;
    private const string GetByIdName = "GetEntryById";
    private const string CacheTag = "Entries";
    
    public EntriesController(IEntryRepository entryRepository, IOutputCacheStore outputCacheStore)
    {
        _entryRepository = entryRepository;
        _outputCacheStore = outputCacheStore;
    }

    // [HttpGet]
    // [OutputCache(Tags = [CacheTag])]
    // public async Task<List<EntryDto>> GetAsync([FromQuery] PaginationDto paginationDto)
    // {
    //     var totalCount = await _entryRepository.CountAsync();
    //     HttpContext.AppendTotalCountInHeader(totalCount);
    //
    //     return await _entryRepository.GetAsync(paginationDto);
    // }
    
    [HttpGet]
    [OutputCache(Tags = [CacheTag])]
    public async Task<List<EntryDto>> GetAsync([FromQuery] EntryFilterDto entryFilterDto)
    {
        var (entryDtos, count) = await _entryRepository.GetAsync(entryFilterDto);
        HttpContext.AppendTotalCountInHeader(count);

        return entryDtos;
    }

    [HttpGet("{id:int}", Name = GetByIdName)]
    [OutputCache(Tags = [CacheTag])]
    public async Task<ActionResult<EntryDto>> GetAsync(int id)
    {
        var entryDto = await _entryRepository.GetAsync(id);

        if (entryDto is null) return EntryNotFoundProblem(id);

        return entryDto;
    }

    [HttpPost]
    public async Task<CreatedAtRouteResult> CreateAsync([FromBody] EntryCreationDto entryCreationDto)
    {
        var entryDto = await _entryRepository.CreateAsync(entryCreationDto);
        await _outputCacheStore.EvictByTagAsync(CacheTag, CancellationToken.None);
        return CreatedAtRoute(GetByIdName, new { id = entryDto.Id }, entryDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] EntryCreationDto entryCreationDto)
    {
        var updated = await _entryRepository.UpdateAsync(id, entryCreationDto);

        if (!updated) return EntryNotFoundProblem(id);
        
        await _outputCacheStore.EvictByTagAsync(CacheTag, CancellationToken.None);
        return NoContent();
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var deleted = await _entryRepository.DeleteAsync(id);

        if (!deleted) return EntryNotFoundProblem(id);
        
        await _outputCacheStore.EvictByTagAsync(CacheTag, CancellationToken.None);
        return NoContent();
    }

    private ObjectResult EntryNotFoundProblem(int id)
    {
        return Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Entry not found",
            detail: $"The entry with id {id} is not found."
        );
    }
}