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
            const string dbName = "Test Dictionary Name";

            dictionaryPath = DictionaryDbManager.GetDbPath(dbId);

            // Act
            await _dictionaryDbManager.CreateAsync(dbId, dbName);

            // Assert
            Assert.True(File.Exists(dictionaryPath));

            await DictionaryDbTestHelper.AssertDatabaseAsync(dictionaryPath, dbName);
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
            dictionaryPath = DictionaryDbManager.GetDbPath(dbId);
            
            const string dbName = "Test Dictionary Name";
            await _dictionaryDbManager.CreateAsync(dbId, dbName);

            // Act
            backupPath = _dictionaryDbManager.CreateBackup(dbId);
        
            // Assert
            Assert.True(File.Exists(backupPath));

            await DictionaryDbTestHelper.AssertDatabaseAsync(backupPath, dbName);
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
    public async Task SaveAsync_ShouldSaveDictionary()
    {
        string? dictionaryPath = null, backupPath = null, savePath = null;

        try
        {
            // Arrange
            var dbId = Guid.NewGuid();
            dictionaryPath = DictionaryDbManager.GetDbPath(dbId);
            
            const string dbName = "Test Dictionary Name";
            await _dictionaryDbManager.CreateAsync(dbId, dbName);

            backupPath = _dictionaryDbManager.CreateBackup(dbId);
            Assert.NotNull(backupPath);
            
            var saveDbId = Guid.NewGuid();
            await using var stream = File.OpenRead(backupPath);

            // Act
            var saveName = await _dictionaryDbManager.SaveAsync(saveDbId, stream);
        
            // Assert
            Assert.Equal(dbName, saveName);

            savePath = DictionaryDbManager.GetDbPath(saveDbId);
            Assert.True(File.Exists(savePath));
            await DictionaryDbTestHelper.AssertDatabaseAsync(savePath, dbName);
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