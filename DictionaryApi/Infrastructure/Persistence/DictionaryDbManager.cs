using Application.Abstractions;
using Domain.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DictionaryDbManager: IDictionaryDbManager
{
    private const string DirectoryName = "PersonalDictionary";
    private const string DbDirectoryName = "Databases";
    private const string BackupDirectoryName = "Backups";
    
    public async Task CreateAsync(Guid dbId, string dbName)
    {
        var dictionaryPath = GetDbPath(dbId);
        await using var dictionaryDbContext = CreateDbContext(dictionaryPath);
        
        // Simulate a delay in database creation.
        // await Task.Delay(TimeSpan.FromSeconds(2));

        await dictionaryDbContext.Database.MigrateAsync();

        dictionaryDbContext.Metadata.Add(new Metadata {Name = dbName});
        await dictionaryDbContext.SaveChangesAsync();
    }

    public string? CreateBackup(Guid dbId)
    {
        var sourcePath = GetDbPath(dbId);

        if (!File.Exists(sourcePath)) return null;
        
        var destinationPath = GetBackupPath(dbId);

        using var sourceConnection = CreateSqliteConnection(sourcePath);
        using var destinationConnection = CreateSqliteConnection(destinationPath);
        
        sourceConnection.Open();
        destinationConnection.Open();
        
        sourceConnection.BackupDatabase(destinationConnection);

        return destinationPath;
    }

    public async Task<string?> SaveAsync(Guid dbId, Stream sourceStream)
    {
        var destinationPath = GetDbPath(dbId);

        await using (var destinationStream = File.Create(destinationPath))
        {
            await sourceStream.CopyToAsync(destinationStream);
        }

        try
        {
            await using var dictionaryDbContext = CreateDbContext(destinationPath);
            await dictionaryDbContext.Database.MigrateAsync();
            var metadata = await dictionaryDbContext.Metadata.SingleAsync();
            return metadata.Name;
        }
        catch (Exception ex) when (ex is SqliteException or InvalidOperationException)
        {
            File.Delete(destinationPath);
            File.Delete($"{destinationPath}-shm");
            File.Delete($"{destinationPath}-wal");
            return null;
        }
    }
    
    internal static string GetDbPath(Guid dbId)
    {
        var directoryPath = CreateDirectory(DbDirectoryName);
        return Path.Combine(directoryPath, $"{dbId}.db");
    }
    
    private static string GetBackupPath(Guid dbId)
    {
        var directoryPath = CreateDirectory(BackupDirectoryName);
        return Path.Combine(directoryPath, $"{dbId}-{Guid.NewGuid()}.db");
    }

    private static string CreateDirectory(string subDictionaryName)
    {
        var tempPath = Path.GetTempPath();
        var directoryPath = Path.Combine(tempPath, DirectoryName, subDictionaryName);

        if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);

        return directoryPath;
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