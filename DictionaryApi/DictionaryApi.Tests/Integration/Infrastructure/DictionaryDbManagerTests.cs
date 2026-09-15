using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DictionaryApi.Tests.Integration.Infrastructure;

public sealed class DictionaryDbManagerTests: IDisposable
{
    private string? _dictionaryPath;
    
    public void Dispose()
    {
        if (_dictionaryPath is not null) DictionaryDbTestHelper.DeleteDb(_dictionaryPath);
    }
    
    [Fact]
    public async Task CreateAsync_ShouldCreateValidDictionary()
    {
        // Arrange
        var dbId = Guid.NewGuid();
        const string defaultName = "Test Dictionary Name";
        
        _dictionaryPath = DictionaryDbPathProvider.GetDbPath(dbId);
        var dictionaryDbManager = new DictionaryDbManager();

        // Act
        await dictionaryDbManager.CreateAsync(dbId, defaultName);
        
        // Assert
        Assert.True(File.Exists(_dictionaryPath));
        
        var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={_dictionaryPath}").Options;
        await using var dictionaryDbContext = new DictionaryDbContext(options);

        var categories = await dictionaryDbContext.Categories.ToListAsync(cancellationToken: TestContext.Current.CancellationToken);
        
        Assert.Equal(2, categories.Count);
        Assert.Equal("word", categories[0].Name);
        Assert.Equal("phrase", categories[1].Name);
        
        var metadata = await dictionaryDbContext.Metadata.SingleAsync(cancellationToken: TestContext.Current.CancellationToken);
        Assert.Equal(defaultName, metadata.Name);
    }

    [Fact]
    public async Task CreateBackup_ShouldCreateValidBackup()
    {
        string? backupPath = null;

        try
        {
            // Arrange
            var dbId = Guid.NewGuid();
            const string defaultName = "Test Dictionary Name";
        
            _dictionaryPath = DictionaryDbPathProvider.GetDbPath(dbId);
            var dictionaryDbManager = new DictionaryDbManager();
        
            await dictionaryDbManager.CreateAsync(dbId, defaultName);

            // Act
            backupPath = dictionaryDbManager.CreateBackup(dbId);
        
            // Assert
            Assert.True(File.Exists(backupPath));
        
            var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={backupPath}").Options;
            await using var dictionaryDbContext = new DictionaryDbContext(options);

            var categories = await dictionaryDbContext.Categories.ToListAsync(cancellationToken: TestContext.Current.CancellationToken);
        
            Assert.Equal(2, categories.Count);
            Assert.Equal("word", categories[0].Name);
            Assert.Equal("phrase", categories[1].Name);
        
            var metadata = await dictionaryDbContext.Metadata.SingleAsync(cancellationToken: TestContext.Current.CancellationToken);
            Assert.Equal(defaultName, metadata.Name);
        }
        finally
        {
            if (backupPath is not null) DictionaryDbTestHelper.DeleteDb(backupPath);
        }
        
    }
}