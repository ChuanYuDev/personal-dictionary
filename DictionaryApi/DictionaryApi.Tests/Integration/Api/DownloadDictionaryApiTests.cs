using System.Net;
using System.Net.Http.Json;
using DictionaryApi.Tests.Integration.TestInfrastructure;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DictionaryApi.Tests.Integration.Api;

public sealed class DownloadDictionaryApiTests: IClassFixture<WebApplicationFactory<Program>>, IDisposable
{
    private readonly HttpClient _httpClient;
    private readonly HttpRequestMessage _httpRequestMessage;
    private const string RequestUri = "/api/dictionaries/download";
    private const string DbIdHeaderKey = "X-DbId";

    public DownloadDictionaryApiTests(WebApplicationFactory<Program> webApplicationFactory)
    {
        _httpClient = webApplicationFactory.CreateClient();
        _httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, RequestUri);
    }

    public void Dispose()
    {
        _httpRequestMessage.Dispose();
    }

    [Fact]
    public async Task Download_ShouldDownloadDictionary()
    {
        string? dictionaryPath = null, downloadedPath = null;
        
        try
        {
            // Arrange
            var dbId = Guid.NewGuid();
            dictionaryPath = DictionaryDbManager.GetDbPath(dbId);
        
            var dictionaryDbManager = new DictionaryDbManager();
            const string dbName = "Test Dictionary Name";
            await dictionaryDbManager.CreateAsync(dbId, dbName);

            _httpRequestMessage.Headers.Add(DbIdHeaderKey, dbId.ToString());
        
            // Act
            using var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, HttpCompletionOption.ResponseHeadersRead, TestContext.Current.CancellationToken);
        
            // Assert
            Assert.Equal(HttpStatusCode.OK, httpResponseMessage.StatusCode);
        
            Assert.Equal("application/vnd.sqlite3", httpResponseMessage.Content.Headers.ContentType?.MediaType);

            await using (var stream = await httpResponseMessage.Content.ReadAsStreamAsync(TestContext.Current.CancellationToken))
            {
                downloadedPath = DictionaryDbManager.GetDbPath(Guid.NewGuid());
                await using (var fileStream = File.Create(downloadedPath))
                {
                    await stream.CopyToAsync(fileStream, TestContext.Current.CancellationToken);
                }
            }

            await DictionaryDbTestHelper.AssertDatabaseAsync(downloadedPath, dbName);
        }
        finally
        {
            DictionaryDbTestHelper.DeleteDb(dictionaryPath);
            DictionaryDbTestHelper.DeleteDb(downloadedPath);
        }
    }

    [Fact]
    public async Task Download_Returns400BadRequest_WhenDbIdIsMissing()
    {
        // Act
        using var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, HttpCompletionOption.ResponseHeadersRead, TestContext.Current.CancellationToken);
        
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, httpResponseMessage.StatusCode);

        var problemDetails = await httpResponseMessage.Content.ReadFromJsonAsync<ProblemDetails>(cancellationToken: TestContext.Current.CancellationToken);

        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status400BadRequest, problemDetails.Status);
        Assert.Equal("No dictionary selected", problemDetails.Title);
    }
    
    [Fact]
    public async Task Download_Returns404NotFound_WhenDictionaryWithDbIdDoesNotExist()
    {
        var dbId = Guid.NewGuid();
        _httpRequestMessage.Headers.Add(DbIdHeaderKey, dbId.ToString());
        
        // Act
        using var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, HttpCompletionOption.ResponseHeadersRead, TestContext.Current.CancellationToken);
        
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, httpResponseMessage.StatusCode);

        var problemDetails = await httpResponseMessage.Content.ReadFromJsonAsync<ProblemDetails>(cancellationToken: TestContext.Current.CancellationToken);

        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status404NotFound, problemDetails.Status);
        Assert.Equal("Dictionary not found", problemDetails.Title);
    }
}