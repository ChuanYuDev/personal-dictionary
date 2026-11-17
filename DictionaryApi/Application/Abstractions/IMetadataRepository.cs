using Application.Dtos;

namespace Application.Abstractions;

public interface IMetadataRepository
{
    Task<MetadataDto> GetAsync();
    Task UpdateNameAsync(MetadataUpdateDto metadataUpdateDto);
}