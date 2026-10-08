using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DictionaryApi.Tests.Integration.TestInfrastructure;

public static class DictionaryDbTestHelper
{
    public static void DeleteDb(string? dbPath)
    {
        if (dbPath is null) return;
        
        File.Delete(dbPath);
        File.Delete($"{dbPath}-shm");
        File.Delete($"{dbPath}-wal");
    }

    public static async Task AssertDatabaseAsync(string dbPath, string dbName)
    {
        await using var dictionaryDbContext = CreateDbContext(dbPath);

        var categories = await dictionaryDbContext.Categories.ToListAsync(cancellationToken: TestContext.Current.CancellationToken);
        
        Assert.Equal(2, categories.Count);
        Assert.Equal("word", categories[0].Name);
        Assert.Equal("phrase", categories[1].Name);
        
        var metadata = await dictionaryDbContext.Metadata.SingleAsync(cancellationToken: TestContext.Current.CancellationToken);
        Assert.Equal(dbName, metadata.Name);
    }
    
    private static DictionaryDbContext CreateDbContext(string dbPath)
    {
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={dbPath}").Options;

        return new DictionaryDbContext(options);
    }
}