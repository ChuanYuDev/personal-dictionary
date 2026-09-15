namespace Infrastructure.Persistence;

public static class DictionaryDbPathProvider
{
    private const string DirectoryName = "PersonalDictionary";
    private const string DbDirectoryName = "Databases";
    private const string BackupDirectoryName = "Backups";
    
    public static string GetDbPath(Guid dbId)
    {
        var directoryPath = CreateDirectory(DbDirectoryName);
        return Path.Combine(directoryPath, $"{dbId}.db");
    }
    
    public static string GetBackupPath(Guid dbId)
    {
        var directoryPath = CreateDirectory(BackupDirectoryName);
        return Path.Combine(directoryPath, $"{dbId}-{Guid.NewGuid()}.db");
    }

    private static string CreateDirectory(string dictionaryName)
    {
        var tempPath = Path.GetTempPath();
        var directoryPath = Path.Combine(tempPath, DirectoryName, dictionaryName);

        if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);

        return directoryPath;
    }
}