using Application.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DictionaryDbManager: IDictionaryDbManager
{
    public async Task CreateAsync(Guid dbId)
    {
        var dictionaryPath = DictionaryDbPathProvider.GetPath(dbId);
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={dictionaryPath}").Options;

        await using var dictionaryDbContext = new DictionaryDbContext(options);

        await dictionaryDbContext.Database.MigrateAsync();
    }
}