using System.Net;
using System.Net.Http.Json;
using Application.Dtos;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DictionaryAPI.Tests.Integration.Api;

public sealed class CreateDictionaryApiTests: IClassFixture<WebApplicationFactory<Program>>, IDisposable
{
    private readonly HttpClient _client;
    private const string DefaultName = "Untitled Dictionary";
    private Guid _dbId;

    public CreateDictionaryApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }
    
    public void Dispose()
    {
        DictionaryDbTestHelper.DeleteDb(_dbId);
    }

    [Fact]
    public async Task Create_ShouldReturnCreatedDictionary()
    {
        // Act
        var response = await _client.PostAsync("/api/dictionaries/create", null, TestContext.Current.CancellationToken);
        
        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var dictionaryDto = await response.Content.ReadFromJsonAsync<DictionaryDto>(cancellationToken: TestContext.Current.CancellationToken);
        Assert.NotNull(dictionaryDto);

        _dbId = dictionaryDto.DbId;
        Assert.NotEqual(Guid.Empty, _dbId);
        Assert.Equal(DefaultName, dictionaryDto.DbName);

        var path = DictionaryDbPathProvider.GetPath(_dbId);
        
        Assert.True(File.Exists(path));
    }
}