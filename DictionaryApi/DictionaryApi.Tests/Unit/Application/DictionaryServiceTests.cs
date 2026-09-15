using Application.Abstractions;
using Application.Services;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Xunit;

namespace DictionaryApi.Tests.Unit.Application;

public sealed class DictionaryServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldCreateDictionaryWithDefaultName()
    {
        // Arrange
        var dictionaryDbManager = Substitute.For<IDictionaryDbManager>();
        var logger = NullLogger<DictionaryService>.Instance;
        
        var dictionaryService = new DictionaryService(dictionaryDbManager, logger);
        const string defaultName = "Untitled Dictionary";
        
        // Act
        var result = await dictionaryService.CreateAsync();
        
        // Assert
        await dictionaryDbManager.Received(1).CreateAsync(result.DbId, defaultName);
        Assert.NotEqual(Guid.Empty, result.DbId);
        Assert.Equal(defaultName, result.DbName);
    }
    
}