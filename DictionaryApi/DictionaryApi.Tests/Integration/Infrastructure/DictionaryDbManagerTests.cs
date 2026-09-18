using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DictionaryApi.Tests.Integration.Infrastructure;

public sealed class DictionaryDbManagerTests: IDisposable
{
    private string? _dictionaryPath;
    private DictionaryDbManager _dictionaryDbManager;

    public DictionaryDbManagerTests()
    {
        _dictionaryDbManager = new DictionaryDbManager();
    }
    
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

        // Act
        await _dictionaryDbManager.CreateAsync(dbId, defaultName);
        
        // Assert
        Assert.True(File.Exists(_dictionaryPath));
        
        await using var dictionaryDbContext = DictionaryDbTestHelper.CreateDbContext(_dictionaryPath);

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
        
            await _dictionaryDbManager.CreateAsync(dbId, defaultName);

            // Act
            backupPath = _dictionaryDbManager.CreateBackup(dbId);
        
            // Assert
            Assert.True(File.Exists(backupPath));
        
            await using var dictionaryDbContext = DictionaryDbTestHelper.CreateDbContext(backupPath);

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

    [Fact]
    public void CreateBackup_ShouldReturnNull_WhenDictionaryDoesNotExist()
    {
        var dbId = Guid.NewGuid();

        var backupPath = _dictionaryDbManager.CreateBackup(dbId);
        
        Assert.Null(backupPath);
    }
}