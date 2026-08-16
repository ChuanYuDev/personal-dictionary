using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DictionaryDbContext: DbContext
{
    public DictionaryDbContext(DbContextOptions options) : base(options)
    {
        
    }
}