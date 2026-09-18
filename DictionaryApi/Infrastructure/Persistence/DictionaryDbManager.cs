using Application.Abstractions;
using Domain.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DictionaryDbManager: IDictionaryDbManager
{
    public async Task CreateAsync(Guid dbId, string defaultDbName)
    {
        var dictionaryPath = DictionaryDbPathProvider.GetDbPath(dbId);
        await using var dictionaryDbContext = CreateDbContext(dictionaryPath);
        
        // Simulate a delay in database creation.
        // await Task.Delay(TimeSpan.FromSeconds(2));

        await dictionaryDbContext.Database.MigrateAsync();

        dictionaryDbContext.Metadata.Add(new Metadata {Name = defaultDbName});
        await dictionaryDbContext.SaveChangesAsync();
    }

    public string? CreateBackup(Guid dbId)
    {
        var sourcePath = DictionaryDbPathProvider.GetDbPath(dbId);

        if (!File.Exists(sourcePath)) return null;
        
        var destinationPath = DictionaryDbPathProvider.GetBackupPath(dbId);

        using var sourceConnection = CreateSqliteConnection(sourcePath);
        using var destinationConnection = CreateSqliteConnection(destinationPath);
        
        sourceConnection.Open();
        destinationConnection.Open();
        
        sourceConnection.BackupDatabase(destinationConnection);

        return destinationPath;
    }

    private static DictionaryDbContext CreateDbContext(string dbPath)
    {
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={dbPath}").Options;

        return new DictionaryDbContext(options);
    }

    private static SqliteConnection CreateSqliteConnection(string dbPath)
    {
        return new SqliteConnection($"Data Source={dbPath}");
    }
}