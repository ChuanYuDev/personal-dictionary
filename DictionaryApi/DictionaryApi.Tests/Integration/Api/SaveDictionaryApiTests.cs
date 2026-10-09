using System.Net;
using System.Net.Http.Json;
using Application.Dtos;
using DictionaryApi.Tests.Integration.TestInfrastructure;
using Infrastructure.Persistence;
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
            
            using var content = new MultipartFormDataContent();
            content.Add(streamContent, "file");
            _httpRequestMessage.Content = content;

            // Act
            using var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, TestContext.Current.CancellationToken);
            
            // Assert
            var problemDetails = await httpResponseMessage.Content.ReadFromJsonAsync<ValidationProblemDetails>(cancellationToken: TestContext.Current.CancellationToken);

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
}