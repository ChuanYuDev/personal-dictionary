using Infrastructure.Persistence;

namespace DictionaryAPI.Tests.Integration;

public static class DictionaryDbTestHelper
{
    public static void DeleteDb(Guid dbId)
    {
        var path = DictionaryDbPathProvider.GetPath(dbId);
        
        File.Delete(path);
        File.Delete($"{path}-shm");
        File.Delete($"{path}-wal");
    }
}