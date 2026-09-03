using System.Net;
using System.Net.Http.Json;
using Application.Abstractions;
using Application.Dtos;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Xunit;

namespace DictionaryApi.Tests.Integration.Api;

public sealed class CreateDictionaryApiTests: IClassFixture<WebApplicationFactory<Program>>, IDisposable
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private const string DefaultName = "Untitled Dictionary";
    private Guid _dbId;

    public CreateDictionaryApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
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

    [Fact]
    public async Task Create_Returns500InternalServerErrorWithProblemDetails_WhenUnexpectedExceptionOccurs()
    {
        // Arrange
        var dictionaryDbManager = Substitute.For<IDictionaryDbManager>();
        dictionaryDbManager.CreateAsync(Arg.Any<Guid>(), Arg.Any<string>()).ThrowsAsync(new Exception());

        var factory = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddTransient<IDictionaryDbManager>(provider => dictionaryDbManager);
            });
        });

        var client = factory.CreateClient();
        
        // Act
        var response = await client.PostAsync("/api/dictionaries/create", null, TestContext.Current.CancellationToken);
        
        // Assert
        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>(cancellationToken: TestContext.Current.CancellationToken);

        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status500InternalServerError, problemDetails.Status);
        Assert.Equal("An unexpected error occurred.", problemDetails.Title);
    }
}