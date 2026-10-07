using Application.Abstractions;
using Application.Errors;
using Application.Services;
using Infrastructure.Persistence;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace DictionaryApi.Tests.Unit.Application;

public sealed class DictionaryServiceTests
{
    private readonly IDictionaryDbManager _dictionaryDbManager;
    private readonly DictionaryService _dictionaryService;
    
    public DictionaryServiceTests()
    {
        _dictionaryDbManager = Substitute.For<IDictionaryDbManager>();
        var logger = NullLogger<DictionaryService>.Instance;
        
        _dictionaryService = new DictionaryService(_dictionaryDbManager, logger);
    }
    
    [Fact]
    public async Task CreateAsync_ShouldCreateDictionaryWithDefaultName()
    {
        // Arrange
        const string defaultName = "Untitled Dictionary";
        
        // Act
        var result = await _dictionaryService.CreateAsync();
        
        // Assert
        await _dictionaryDbManager.Received(1).CreateAsync(result.DbId, defaultName);
        Assert.NotEqual(Guid.Empty, result.DbId);
        Assert.Equal(defaultName, result.DbName);
    }

    [Fact]
    public async Task CreateBackupStream_ShouldReturnBackupStreamAndDeleteBackup_WhenStreamIsDisposed()
    {
        // Arrange
        var dbId = Guid.NewGuid();
        
        var path = DictionaryDbManager.GetDbPath(dbId);
        byte[] content = [1, 2, 3, 4, 5];
        await File.WriteAllBytesAsync(path, content, TestContext.Current.CancellationToken);

        _dictionaryDbManager.CreateBackup(dbId).Returns(path);
        
        // Act
        var result = _dictionaryService.CreateBackupStream(dbId);
        
        // Assert
        Assert.True(result.IsSuccess);

        await using (var stream = result.Value)
        {
            await using var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream, TestContext.Current.CancellationToken);
            Assert.Equal(content, memoryStream.ToArray());
        }
        
        Assert.False(File.Exists(path));
    }

    [Fact]
    public void CreateBackupStream_ShouldReturnNotFound_WhenDictionaryDoesNotExist()
    {
        var dbId = Guid.NewGuid();

        _dictionaryDbManager.CreateBackup(dbId).Returns((string?)null);
        
        var result = _dictionaryService.CreateBackupStream(dbId);
        
        Assert.False(result.IsSuccess);
        Assert.Equal(DictionaryErrors.NotFound, result.Error);
    }
}