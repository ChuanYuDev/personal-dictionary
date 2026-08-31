using Application.Abstractions;
using Application.Services;
using NSubstitute;

namespace DictionaryAPI.Tests.Unit.Application;

[TestClass]
public sealed class DictionaryServiceTests
{
    [TestMethod]
    public async Task CreateAsync_ShouldCreateDictionaryWithDefaultName()
    {
        // Arrange
        var dictionaryDbManager = Substitute.For<IDictionaryDbManager>();
        var dictionaryService = new DictionaryService(dictionaryDbManager);
        const string defaultName = "Untitled Dictionary";
        
        // Act
        var result = await dictionaryService.CreateAsync();
        
        // Assert
        await dictionaryDbManager.Received(1).CreateAsync(result.DbId, defaultName);
        Assert.AreNotEqual(Guid.Empty, result.DbId);
        Assert.AreEqual(defaultName, result.DbName);
    }
    
}