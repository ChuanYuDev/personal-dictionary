using Application.Abstractions;
using Application.Dtos;
using DictionaryApi.Filters;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Controllers;

[Route("api/metadata")]
[ApiController]
public class MetadataController: ControllerBase
{
    private readonly IMetadataRepository _metadataRepository;

    public MetadataController(IMetadataRepository metadataRepository)
    {
        _metadataRepository = metadataRepository;
    }

    [HttpGet]
    public async Task<MetadataDto> GetAsync()
    {
        return await _metadataRepository.GetAsync();
    }
    
    [HttpPut]
    [ServiceFilter<ValidateDbIdActionFilter>]
    public async Task<IActionResult> UpdateNameAsync([FromBody] MetadataUpdateDto metadataUpdateDto)
    {
        await _metadataRepository.UpdateNameAsync(metadataUpdateDto);
        return NoContent();
    }
}