using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DictionaryDatabaseManager
{
    public async Task CreateAsync(Guid dbId)
    {
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite().Options;
    }
}