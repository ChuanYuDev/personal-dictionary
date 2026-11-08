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

    public async Task<(List<EntrySummaryDto>, int count)> GetAsync(EntryFilterDto entryFilterDto)
    {
        var entries = _context.Entries.AsQueryable();

        var term = entryFilterDto.Term ?? "";

        var exactMatch = entryFilterDto.ExactMatch;
        entries = exactMatch == true
            ? entries.Where(e => e.Term == term)
            : entries.Where(e => e.Term.Contains(term));
        
        var isFavorite = entryFilterDto.IsFavorite;
        if (isFavorite == true) entries = entries.Where(e => e.IsFavorite);

        var categoryId = entryFilterDto.CategoryId;
        if (categoryId is not null) entries = entries.Where(e => e.CategoryId == categoryId);
        
        entries = (term == "") && (exactMatch != true) && (isFavorite != true) && (categoryId is null)
            ? entries.OrderByDescending(e => e.ModifiedAt)
            : entries.OrderBy(e => e.Term).ThenBy(e => e.CategoryId).ThenBy(e => e.PartOfSpeech).ThenBy(e => e.Id);

        var count = await entries.CountAsync();

        if (entryFilterDto.Paginate) entries = entries.Paginate(entryFilterDto);
        
        var entrySummaryDtos = await entries
            .ProjectTo<EntrySummaryDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return (entrySummaryDtos, count);
    }

    public async Task<EntryDetailsDto?> GetAsync(int id)
    {
        return await _context.Entries
            .ProjectTo<EntryDetailsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(e => e.Id == id);
    }
    
    public async Task<EntryDetailsDto> CreateAsync(EntryCreationDto entryCreationDto)
    {
        var entry = _mapper.Map<Entry>(entryCreationDto);
        
        _context.Add(entry);
        await _context.SaveChangesAsync();

        return await _context.Entries
            .ProjectTo<EntryDetailsDto>(_mapper.ConfigurationProvider)
            .SingleAsync(e => e.Id == entry.Id);
    }

    public async Task<bool> UpdateAsync(int id, EntryCreationDto entryCreationDto)
    {
        var entry = await _context.Entries.FirstOrDefaultAsync(e => e.Id == id);

        if (entry is null) return false;

        _mapper.Map(entryCreationDto, entry);
        entry.ModifiedAt = DateTime.UtcNow;
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