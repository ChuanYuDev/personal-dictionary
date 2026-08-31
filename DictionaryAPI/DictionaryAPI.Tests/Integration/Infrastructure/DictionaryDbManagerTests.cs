using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DictionaryAPI.Tests.Integration.Infrastructure;

[TestClass]
public class DictionaryDbManagerTests
{
    [TestMethod]
    public async Task CreateAsync_ShouldCreateValidDictionaryDatabase()
    {
        // Arrange
        var dbId = Guid.NewGuid();
        const string defaultName = "Untitled Dictionary";
        
        var path = DictionaryDbPathProvider.GetPath(dbId);
        var dictionaryDbManager = new DictionaryDbManager();

        try
        {
            // Act
            await dictionaryDbManager.CreateAsync(dbId, defaultName);
            
            // Assert
            Assert.IsTrue(File.Exists(path));
            
            var options = new DbContextOptionsBuilder<DictionaryDbContext>().UseSqlite($"Data Source={path}").Options;
            await using var dictionaryDbContext = new DictionaryDbContext(options);

            var categories = await dictionaryDbContext.Categories.ToListAsync();
            Assert.AreEqual("word", categories[0].Name);
            Assert.AreEqual("phrase", categories[1].Name);
            
            var metadata = await dictionaryDbContext.Metadata.SingleAsync();
            Assert.AreEqual(defaultName, metadata.Name);
            
        }
        finally
        {
            if (File.Exists(path)) File.Delete(path);
        }
        
    }
}