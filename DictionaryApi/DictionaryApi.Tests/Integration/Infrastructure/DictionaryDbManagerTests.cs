using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DictionaryApi.Tests.Integration.Infrastructure;

public sealed class DictionaryDbManagerTests: IDisposable
{
    private Guid _dbId;
    
    public void Dispose()
    {
        DictionaryDbTestHelper.DeleteDb(_dbId);
    }
    
    [Fact]
    public async Task CreateAsync_ShouldCreateValidDictionaryDatabase()
    {
        // Arrange
        _dbId = Guid.NewGuid();
        const string defaultName = "Untitled Dictionary";
        
        var path = DictionaryDbPathProvider.GetPath(_dbId);
        var dictionaryDbManager = new DictionaryDbManager();

        // Act
        await dictionaryDbManager.CreateAsync(_dbId, defaultName);
        
        // Assert
        Assert.True(File.Exists(path));
        
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={path}").Options;
        await using var dictionaryDbContext = new DictionaryDbContext(options);

        var categories = await dictionaryDbContext.Categories.ToListAsync(cancellationToken: TestContext.Current.CancellationToken);
        Assert.Equal("word", categories[0].Name);
        Assert.Equal("phrase", categories[1].Name);
        
        var metadata = await dictionaryDbContext.Metadata.SingleAsync(cancellationToken: TestContext.Current.CancellationToken);
        Assert.Equal(defaultName, metadata.Name);
    }
}