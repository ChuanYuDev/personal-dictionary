using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Persistence;

public class DictionaryDbContextFactory: IDesignTimeDbContextFactory<DictionaryDbContext>
{
    public DictionaryDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source=design-time.db").Options;

        return new DictionaryDbContext(options);
    }
}