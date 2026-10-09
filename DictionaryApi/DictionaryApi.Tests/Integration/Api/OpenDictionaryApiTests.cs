using System.Net;
using System.Net.Http.Json;
using Application.Dtos;
using DictionaryApi.Tests.Integration.TestInfrastructure;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DictionaryApi.Tests.Integration.Api;

public sealed class SaveDictionaryApiTests: IClassFixture<WebApplicationFactory<Program>>, IDisposable
{
    private readonly HttpClient _httpClient;
    private readonly HttpRequestMessage _httpRequestMessage;
    private const string RequestUri = "/api/dictionaries/open";

    public SaveDictionaryApiTests(WebApplicationFactory<Program> webApplicationFactory)
    {
        _httpClient = webApplicationFactory.CreateClient();
        _httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, RequestUri);
    }
    
    public void Dispose()
    {
        _httpRequestMessage.Dispose();
    }

    [Fact]
    public async Task OpenAsync_ShouldSaveDictionary()
    {
        string? dictionaryPath = null, backupPath = null, savePath = null;

        try
        {
            // Arrange
            var dbId = Guid.NewGuid();
            dictionaryPath = DictionaryDbManager.GetDbPath(dbId);

            var dictionaryDbManager = new DictionaryDbManager();
            const string dbName = "Test Dictionary Name";
            await dictionaryDbManager.CreateAsync(dbId, dbName);

            backupPath = dictionaryDbManager.CreateBackup(dbId);
            Assert.NotNull(backupPath);

            await using var backupStream = File.OpenRead(backupPath);
            using var streamContent = new StreamContent(backupStream);
            
            _httpRequestMessage.Content = streamContent;

            // Act
            using var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, TestContext.Current.CancellationToken);
            
            // Assert
            Assert.Equal(HttpStatusCode.OK, httpResponseMessage.StatusCode);
            
            var dictionaryDto = await httpResponseMessage.Content.ReadFromJsonAsync<DictionaryDto>(TestContext.Current.CancellationToken);
            Assert.NotNull(dictionaryDto);

            var saveId = dictionaryDto.DbId;
            
            Assert.NotEqual(Guid.Empty, saveId);
            Assert.Equal(dbName, dictionaryDto.DbName);

            savePath = DictionaryDbManager.GetDbPath(saveId);
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
    public async Task OpenAsync_ShouldReturn400BadRequest_WhenDictionaryIsInvalid()
    {
        // Arrange
        byte[] bytes = [1, 2, 3, 4, 5];
        var stream = new MemoryStream(bytes);

        using var streamContent = new StreamContent(stream);
        
        _httpRequestMessage.Content = streamContent;

        // Act
        using var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, TestContext.Current.CancellationToken);
        
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, httpResponseMessage.StatusCode);
        
        var problemDetails = await httpResponseMessage.Content.ReadFromJsonAsync<ProblemDetails>(TestContext.Current.CancellationToken);
        
        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status400BadRequest, problemDetails.Status);
        Assert.Equal("Dictionary invalid", problemDetails.Title);
    }
}