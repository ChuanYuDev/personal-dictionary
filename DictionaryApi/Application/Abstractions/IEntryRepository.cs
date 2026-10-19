using Application.Dtos;
using Domain.Entities;

namespace Application.Abstractions;

public interface IEntryRepository
{
    Task<int> CountAsync();

    Task<List<EntryDto>> GetAsync(PaginationDto paginationDto);

    Task<EntryDto?> GetAsync(int id);
    
    Task<EntryDto> CreateAsync(EntryCreationDto entryCreationDto);
}