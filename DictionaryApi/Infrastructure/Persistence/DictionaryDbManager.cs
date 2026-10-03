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

    public async Task<string?> SaveAsync(Guid dbId, Stream sourceStream)
    {
        var destinationPath = DictionaryDbPathProvider.GetDbPath(dbId);

        await using (var destinationStream = File.Create(destinationPath))
        {
            await sourceStream.CopyToAsync(destinationStream);
        }

        try
        {
            await using var dictionaryDbContext = CreateDbContext(destinationPath);
            var metadata = await dictionaryDbContext.Metadata.SingleAsync();
            return metadata.Name;
        }
        catch
        {
            File.Delete(destinationPath);
            File.Delete($"{destinationPath}-shm");
            File.Delete($"{destinationPath}-wal");
            return null;
        }
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