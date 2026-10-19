using Application.Abstractions;
using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class EntryRepository: IEntryRepository
{
    private readonly DictionaryDbContext _context;
    private readonly IMapper _mapper;

    public EntryRepository(DictionaryDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<int> CountAsync()
    {
        return await _context.Entries.CountAsync();
    }

    public async Task<List<EntryDto>> GetAsync(PaginationDto paginationDto)
    {
        return await _context.Entries
            .OrderByDescending(e => e.CreatedAt)
            .Paginate(paginationDto)
            .ProjectTo<EntryDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // public async Task<EntryDto?>
    
    public async Task<EntryDto> CreateAsync(EntryCreationDto entryCreationDto)
    {
        var entry = _mapper.Map<Entry>(entryCreationDto);
        
        _context.Add(entry);
        await _context.SaveChangesAsync();

        var entryDto = await _context.Entries
            .ProjectTo<EntryDto>(_mapper.ConfigurationProvider)
            .SingleAsync(e => e.Id == entry.Id);
        
        return entryDto;
    }
}