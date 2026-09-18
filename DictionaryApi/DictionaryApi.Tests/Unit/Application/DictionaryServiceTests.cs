using Application.Abstractions;
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
    public async Task Download_ShouldReturnBackupStream()
    {
        // Arrange
        var dbId = Guid.NewGuid();
        
        var backupPath = DictionaryDbPathProvider.GetBackupPath(dbId);
        byte[] content = [1, 2, 3, 4, 5];
        await File.WriteAllBytesAsync(backupPath, content, TestContext.Current.CancellationToken);

        _dictionaryDbManager.CreateBackup(dbId).Returns(backupPath);
        
        // Act
        await using var stream = _dictionaryService.Download(dbId);
        
        // Assert
        await using var memoryStream = new MemoryStream();
        await stream.CopyToAsync(memoryStream, TestContext.Current.CancellationToken);
        Assert.Equal(content, memoryStream.ToArray());
    }

    [Fact]
    public async Task Download_ShouldDeleteBackup_WhenStreamIsDisposed()
    {
        var dbId = Guid.NewGuid();
        
        var backupPath = DictionaryDbPathProvider.GetBackupPath(dbId);
        byte[] content = [1, 2, 3, 4, 5];
        await File.WriteAllBytesAsync(backupPath, content, TestContext.Current.CancellationToken);

        _dictionaryDbManager.CreateBackup(dbId).Returns(backupPath);
        
        // Act
        var stream = _dictionaryService.Download(dbId);
        
        // Assert
        Assert.True(File.Exists(backupPath));
        await stream.DisposeAsync();
        Assert.False(File.Exists(backupPath));
    }
}