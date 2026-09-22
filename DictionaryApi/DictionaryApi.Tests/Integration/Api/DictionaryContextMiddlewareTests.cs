using System.Net;
using System.Net.Http.Json;
using DictionaryApi.Tests.Integration.TestInfrastructure;
using Xunit;

namespace DictionaryApi.Tests.Integration.Api;

public class DictionaryContextMiddlewareTests: IClassFixture<WebApplicationFactoryWithTestController<Program>>
{
    private readonly HttpClient _httpClient;
    private readonly HttpRequestMessage _httpRequestMessage;
    private const string DbIdHeaderKey = "X-DbId";

    public DictionaryContextMiddlewareTests(WebApplicationFactoryWithTestController<Program> factory)
    {
        _httpClient = factory.CreateClient();
        _httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, "/api/test/dictionary-context");
    }

    [Fact]
    public async Task InvokeAsync_ShouldReturnDbId_WhenDbIdHeaderIsValid()
    {
        var expectedDbId = Guid.NewGuid();
        _httpRequestMessage.Headers.Add(DbIdHeaderKey, expectedDbId.ToString());
        
        var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, TestContext.Current.CancellationToken);
        
        Assert.Equal(HttpStatusCode.OK, httpResponseMessage.StatusCode);
        var dbId = await httpResponseMessage.Content.ReadFromJsonAsync<Guid>(cancellationToken: TestContext.Current.CancellationToken);
        
        Assert.Equal(expectedDbId, dbId);
    }

    [Fact]
    public async Task InvokeAsync_ShouldReturnEmpty_WhenDbIdHeaderIsMissing()
    {
        var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, TestContext.Current.CancellationToken);
        
        var dbId = await httpResponseMessage.Content.ReadFromJsonAsync<Guid>(cancellationToken: TestContext.Current.CancellationToken);
        
        Assert.Equal(Guid.Empty, dbId);
    }
    
    [Fact]
    public async Task InvokeAsync_ShouldReturnEmpty_WhenDbIdHeaderIsInvalid()
    {
        _httpRequestMessage.Headers.Add(DbIdHeaderKey, "Invalid-DbId");
        
        var httpResponseMessage = await _httpClient.SendAsync(_httpRequestMessage, TestContext.Current.CancellationToken);
        
        var dbId = await httpResponseMessage.Content.ReadFromJsonAsync<Guid>(cancellationToken: TestContext.Current.CancellationToken);
        
        Assert.Equal(Guid.Empty, dbId);
    }
}