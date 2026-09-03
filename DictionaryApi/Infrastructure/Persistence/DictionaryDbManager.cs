using Application.Abstractions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DictionaryDbManager: IDictionaryDbManager
{
    public async Task CreateAsync(Guid dbId, string defaultName)
    {
        var dictionaryPath = DictionaryDbPathProvider.GetPath(dbId);
        await using var dictionaryDbContext = CreateDbContext(dictionaryPath);
        
        // Simulate a delay in database creation.
        // await Task.Delay(TimeSpan.FromSeconds(2));

        await dictionaryDbContext.Database.MigrateAsync();

        dictionaryDbContext.Metadata.Add(new Metadata {Name = defaultName});
        await dictionaryDbContext.SaveChangesAsync();
    }

    private static DictionaryDbContext CreateDbContext(string dictionaryPath)
    {
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={dictionaryPath}").Options;

        return new DictionaryDbContext(options);
    }
}