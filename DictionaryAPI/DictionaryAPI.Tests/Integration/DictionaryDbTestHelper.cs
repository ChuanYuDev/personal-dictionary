using Infrastructure.Persistence;

namespace DictionaryApi.Tests.Integration;

public static class DictionaryDbTestHelper
{
    public static void DeleteDb(Guid dbId)
    {
        if (dbId == Guid.Empty) return;
        
        var path = DictionaryDbPathProvider.GetPath(dbId);
        
        File.Delete(path);
        File.Delete($"{path}-shm");
        File.Delete($"{path}-wal");
    }
}