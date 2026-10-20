using Application.Dtos;
using Domain.Entities;

namespace Application.Abstractions;

public interface IEntryRepository
{
    // Task<int> CountAsync();

    // Task<List<EntryDto>> GetAsync(PaginationDto paginationDto);
    Task<(List<EntryDto>, int count)> GetAsync(EntryFilterDto entryFilterDto);

    Task<EntryDto?> GetAsync(int id);
    
    Task<EntryDto> CreateAsync(EntryCreationDto entryCreationDto);

    Task<bool> UpdateAsync(int id, EntryCreationDto entryCreationDto);

    Task<bool> DeleteAsync(int id);
}