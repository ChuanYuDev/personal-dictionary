using Application.Dtos;
using Domain.Entities;

namespace Application.Abstractions;

public interface IEntryRepository
{
    // Task<int> CountAsync();

    // Task<List<EntryDto>> GetAsync(PaginationDto paginationDto);
    Task<(List<EntrySummaryDto>, int count)> GetAsync(EntryFilterDto entryFilterDto);

    Task<EntryDetailsDto?> GetAsync(int id);
    
    Task<EntryDetailsDto> CreateAsync(EntryCreationDto entryCreationDto);

    Task<bool> UpdateAsync(int id, EntryCreationDto entryCreationDto);

    Task<bool> DeleteAsync(int id);
}