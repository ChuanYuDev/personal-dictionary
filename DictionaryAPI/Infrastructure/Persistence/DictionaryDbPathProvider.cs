namespace Infrastructure.Persistence;

public static class DictionaryDbPathProvider
{
    private const string DirectoryName = "PersonalDictionary";
    
    public static string GetPath(Guid dbId)
    {
        var tempPath = Path.GetTempPath();
        var directoryPath = Path.Combine(tempPath, DirectoryName);
        
        Console.WriteLine(directoryPath);

        if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);

        return Path.Combine(directoryPath, $"{dbId}.db");
    }
}