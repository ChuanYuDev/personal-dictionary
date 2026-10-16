using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Persistence;

public static class DictionaryDbContextExtensions
{
    public static IServiceCollection AddDictionaryDbContext(this IServiceCollection services, Func<IServiceProvider, Guid> dbIdFactory)
    {
        services.AddDbContext<DictionaryDbContext>((serviceProvider, optionsBuilder) =>
        {
            var dbId = dbIdFactory(serviceProvider);
            var dictionaryPath = DictionaryDbManager.GetDbPath(dbId);
            optionsBuilder.UseSqlite($"Data Source={dictionaryPath}");
        });

        return services;
    }
}