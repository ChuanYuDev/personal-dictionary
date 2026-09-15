using Infrastructure.Persistence;

namespace DictionaryApi.Tests.Integration;

public static class DictionaryDbTestHelper
{
    public static void DeleteDb(string path)
    {
        File.Delete(path);
        File.Delete($"{path}-shm");
        File.Delete($"{path}-wal");
    }
}