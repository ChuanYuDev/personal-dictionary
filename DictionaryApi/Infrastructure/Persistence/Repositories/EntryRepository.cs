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

    public async Task<EntryDto?> GetAsync(int id)
    {
        return await _context.Entries
            .ProjectTo<EntryDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(e => e.Id == id);
    }
    
    public async Task<EntryDto> CreateAsync(EntryCreationDto entryCreationDto)
    {
        var entry = _mapper.Map<Entry>(entryCreationDto);
        
        _context.Add(entry);
        await _context.SaveChangesAsync();

        return await _context.Entries
            .ProjectTo<EntryDto>(_mapper.ConfigurationProvider)
            .SingleAsync(e => e.Id == entry.Id);
    }

    public async Task<bool> UpdateAsync(int id, EntryCreationDto entryCreationDto)
    {
        var entry = await _context.Entries.FirstOrDefaultAsync(e => e.Id == id);

        if (entry is null) return false;

        _mapper.Map(entryCreationDto, entry);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entry = await _context.Entries.FirstOrDefaultAsync(e => e.Id == id);

        if (entry is null) return false;

        _context.Remove(entry);
        await _context.SaveChangesAsync();
        return true;
    }
}