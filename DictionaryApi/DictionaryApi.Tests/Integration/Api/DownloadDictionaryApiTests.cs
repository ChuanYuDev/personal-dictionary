using System.Net;
using System.Net.Http.Json;
using DictionaryApi.Tests.Integration.TestInfrastructure;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DictionaryApi.Tests.Integration.Api;

public class DownloadDictionaryApiTests: IClassFixture<WebApplicationFactory<Program>>
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

    [Fact]
    public async Task Download_ShouldDownloadDictionary_WhenDictionaryWithDbIdExists()
    {
        string? createdPath = null, downloadedPath = null;
        
        try
        {
            // Arrange
            var dbId = Guid.NewGuid();
            createdPath = DictionaryDbPathProvider.GetDbPath(dbId);
        
            var dictionaryDbManager = new DictionaryDbManager();
            const string defaultName = "Untitled Dictionary";
            await dictionaryDbManager.CreateAsync(dbId, defaultName);

            _httpRequestMessage.Headers.Add(DbIdHeaderKey, dbId.ToString());
        
            // Act
            var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, HttpCompletionOption.ResponseHeadersRead, TestContext.Current.CancellationToken);
        
            // Assert
            Assert.Equal(HttpStatusCode.OK, httpResponseMessage.StatusCode);
        
            Assert.Equal("application/vnd.sqlite3", httpResponseMessage.Content.Headers.ContentType?.MediaType);

            await using (var stream = await httpResponseMessage.Content.ReadAsStreamAsync(TestContext.Current.CancellationToken))
            {
                downloadedPath = DictionaryDbPathProvider.GetDbPath(Guid.NewGuid());
                await using (var fileStream = File.Create(downloadedPath))
                {
                    await stream.CopyToAsync(fileStream, TestContext.Current.CancellationToken);
                }
            }
        
            await using var dictionaryDbContext = DictionaryDbTestHelper.CreateDbContext(downloadedPath);

            var categories = await dictionaryDbContext.Categories.ToListAsync(cancellationToken: TestContext.Current.CancellationToken);
        
            Assert.Equal(2, categories.Count);
            Assert.Equal("word", categories[0].Name);
            Assert.Equal("phrase", categories[1].Name);
        
            var metadata = await dictionaryDbContext.Metadata.SingleAsync(cancellationToken: TestContext.Current.CancellationToken);
            Assert.Equal(defaultName, metadata.Name);
        }
        finally
        {
            if (createdPath is not null) DictionaryDbTestHelper.DeleteDb(createdPath);
            if (downloadedPath is not null) DictionaryDbTestHelper.DeleteDb(downloadedPath);
        }
    }

    [Fact]
    public async Task Download_Returns400BadRequest_WhenDbIdIsMissing()
    {
        // Act
        var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, HttpCompletionOption.ResponseHeadersRead, TestContext.Current.CancellationToken);
        
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
        var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, HttpCompletionOption.ResponseHeadersRead, TestContext.Current.CancellationToken);
        
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, httpResponseMessage.StatusCode);

        var problemDetails = await httpResponseMessage.Content.ReadFromJsonAsync<ProblemDetails>(cancellationToken: TestContext.Current.CancellationToken);

        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status404NotFound, problemDetails.Status);
        Assert.Equal("Dictionary not found", problemDetails.Title);
    }
}