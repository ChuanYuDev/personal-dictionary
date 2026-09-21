using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DictionaryApi.Tests.Integration.TestInfrastructure;

public static class DictionaryDbTestHelper
{
    public static void DeleteDb(string path)
    {
        File.Delete(path);
        File.Delete($"{path}-shm");
        File.Delete($"{path}-wal");
    }
    
    public static DictionaryDbContext CreateDbContext(string dbPath)
    {
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={dbPath}").Options;

        return new DictionaryDbContext(options);
    }
}