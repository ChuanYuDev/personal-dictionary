using DictionaryApi.Tests.Integration.TestInfrastructure;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DictionaryApi.Tests.Integration.Infrastructure;

public sealed class DictionaryDbManagerTests
{
    private readonly DictionaryDbManager _dictionaryDbManager;

    public DictionaryDbManagerTests()
    {
        _dictionaryDbManager = new DictionaryDbManager();
    }
    
    [Fact]
    public async Task CreateAsync_ShouldCreateValidDictionary()
    {
        string? dictionaryPath = null;

        try
        {
            // Arrange
            var dbId = Guid.NewGuid();
            const string defaultName = "Test Dictionary Name";

            dictionaryPath = DictionaryDbManager.GetDbPath(dbId);

            // Act
            await _dictionaryDbManager.CreateAsync(dbId, defaultName);

            // Assert
            Assert.True(File.Exists(dictionaryPath));

            await using var dictionaryDbContext = DictionaryDbTestHelper.CreateDbContext(dictionaryPath);

            var categories = await dictionaryDbContext.Categories.ToListAsync(cancellationToken: TestContext.Current.CancellationToken);

            Assert.Equal(2, categories.Count);
            Assert.Equal("word", categories[0].Name);
            Assert.Equal("phrase", categories[1].Name);

            var metadata = await dictionaryDbContext.Metadata.SingleAsync(cancellationToken: TestContext.Current.CancellationToken);
            Assert.Equal(defaultName, metadata.Name);
        }
        finally
        { 
            DictionaryDbTestHelper.DeleteDb(dictionaryPath);
        }
    }

    [Fact]
    public async Task CreateBackup_ShouldCreateValidBackup()
    {
        string? dictionaryPath = null, backupPath = null;

        try
        {
            // Arrange
            var dbId = Guid.NewGuid();
            const string defaultName = "Test Dictionary Name";
        
            dictionaryPath = DictionaryDbManager.GetDbPath(dbId);
        
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
            DictionaryDbTestHelper.DeleteDb(dictionaryPath);
            DictionaryDbTestHelper.DeleteDb(backupPath);
        }
    }

    [Fact]
    public void CreateBackup_ShouldReturnNull_WhenDictionaryDoesNotExist()
    {
        var dbId = Guid.NewGuid();

        var backupPath = _dictionaryDbManager.CreateBackup(dbId);
        
        Assert.Null(backupPath);
    }

    [Fact]
    public async Task SaveAsync_ShouldSaveDictionary_WhenDictionaryIsValid()
    {
        string? dictionaryPath = null, backupPath = null, savePath = null;

        try
        {
            // Arrange
            var dbId = Guid.NewGuid();
            dictionaryPath = DictionaryDbManager.GetDbPath(dbId);
            
            const string defaultName = "Test Dictionary Name";
            await _dictionaryDbManager.CreateAsync(dbId, defaultName);

            var saveDbId = Guid.NewGuid();
            backupPath = _dictionaryDbManager.CreateBackup(dbId);
            Assert.NotNull(backupPath);
            await using var stream = File.OpenRead(backupPath);

            // Act
            var saveName = await _dictionaryDbManager.SaveAsync(saveDbId, stream);
        
            // Assert
            Assert.Equal(defaultName, saveName);

            savePath = DictionaryDbManager.GetDbPath(saveDbId);
            Assert.True(File.Exists(savePath));
        }
        finally
        {
            DictionaryDbTestHelper.DeleteDb(dictionaryPath);
            DictionaryDbTestHelper.DeleteDb(backupPath);
            DictionaryDbTestHelper.DeleteDb(savePath);
        }
    }

    [Fact]
    public async Task SaveAsync_ShouldReturnNull_WhenDictionaryIsInvalid()
    {
        var saveDbId = Guid.NewGuid();
        
        byte[] bytes = [1, 2, 3, 4, 5];
        var stream = new MemoryStream(bytes);
        
        // Act
        var saveName = await _dictionaryDbManager.SaveAsync(saveDbId, stream);
        
        // Assert
        Assert.Null(saveName);
        
        var savePath = DictionaryDbManager.GetDbPath(saveDbId);
        Assert.False(File.Exists(savePath));
    }
}