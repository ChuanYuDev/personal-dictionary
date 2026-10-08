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
    public async Task CreateAsync_ShouldReturnDbIdAndDefaultName()
    {
        // Arrange
        const string defaultName = "Untitled Dictionary";
        
        // Act
        var dictionaryDto = await _dictionaryService.CreateAsync();
        
        // Assert
        await _dictionaryDbManager.Received(1).CreateAsync(dictionaryDto.DbId, defaultName);
        Assert.NotEqual(Guid.Empty, dictionaryDto.DbId);
        Assert.Equal(defaultName, dictionaryDto.DbName);
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
        _dictionaryDbManager.Received(1).CreateBackup(dbId);
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

    [Fact]
    public async Task SaveAsync_ShouldReturnDbIdAndDbName()
    {
        var stream = new MemoryStream();
        const string dbName = "Test Dictionary Name";

        _dictionaryDbManager.SaveAsync(Arg.Any<Guid>(), stream).Returns(dbName);

        var result = await _dictionaryService.SaveAsync(stream);

        Assert.True(result.IsSuccess);
        var dictionaryDto = result.Value;
        
        await _dictionaryDbManager.Received(1).SaveAsync(dictionaryDto.DbId, stream);

        Assert.NotEqual(Guid.Empty, dictionaryDto.DbId);
        Assert.Equal(dbName, dictionaryDto.DbName);
    }
    
    [Fact]
    public async Task SaveAsync_ShouldReturnInvalid_WhenDictionaryIsInvalid()
    {
        var stream = new MemoryStream();
        
        _dictionaryDbManager.SaveAsync(Arg.Any<Guid>(), stream).Returns((string?) null);

        var result = await _dictionaryService.SaveAsync(stream);
        
        Assert.False(result.IsSuccess);
        Assert.Equal(result.Error, DictionaryErrors.Invalid);
    }
}