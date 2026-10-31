using Application.Abstractions;
using Application.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class DictionaryRepository: IDictionaryRepository
{
    private readonly DictionaryDbContext _context;

    public DictionaryRepository(DictionaryDbContext context)
    {
        _context = context;
    }
    
    public async Task<string> UpdateNameAsync(string name)
    {
        var metadata = await _context.Metadata.SingleAsync();
        
        // May modify invalid name later
        metadata.Name = name;
        await _context.SaveChangesAsync();
        
        return name;
    }
}