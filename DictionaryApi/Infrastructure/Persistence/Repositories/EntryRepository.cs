using Application.Abstractions;
using Domain.Entities;

namespace Infrastructure.Persistence.Repositories;

public class EntryRepository: IEntryRepository
{
    private readonly DictionaryDbContext _context;

    public EntryRepository(DictionaryDbContext context)
    {
        _context = context;
    }
    
    public async Task CreateAsync(Entry entry)
    {
        _context.Add(entry);
        await _context.SaveChangesAsync();
    }
}