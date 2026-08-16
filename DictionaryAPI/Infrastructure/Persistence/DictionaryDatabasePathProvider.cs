namespace Infrastructure.Persistence;

public static class DictionaryDatabasePathProvider
{
    private const string DirectoryName = "PersonalDictionary";
    
    public static string GetPath(Guid dbId)
    {
        var tempPath = Path.GetTempPath();
        var rootPath = Path.Combine(tempPath, DirectoryName);

        return Path.Combine(rootPath, $"{dbId}.db");
    }
}