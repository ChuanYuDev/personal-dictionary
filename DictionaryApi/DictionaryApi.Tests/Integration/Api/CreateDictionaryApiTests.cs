using System.Net;
using System.Net.Http.Json;
using Application.Abstractions;
using Application.Dtos;
using DictionaryApi.Tests.Integration.TestInfrastructure;
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

public sealed class CreateDictionaryApiTests: IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _httpClient;
    private const string DefaultName = "Untitled Dictionary";

    public CreateDictionaryApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task Create_ShouldReturnCreatedDictionary()
    {
        string? path = null;

        try
        {
            // Act
            var httpResponseMessage = await _httpClient.PostAsync("/api/dictionaries/create", null, TestContext.Current.CancellationToken);

            // Assert
            Assert.Equal(HttpStatusCode.OK, httpResponseMessage.StatusCode);

            var dictionaryDto = await httpResponseMessage.Content.ReadFromJsonAsync<DictionaryDto>(cancellationToken: TestContext.Current.CancellationToken);
            Assert.NotNull(dictionaryDto);

            var dbId = dictionaryDto.DbId;
            Assert.NotEqual(Guid.Empty, dbId);
            Assert.Equal(DefaultName, dictionaryDto.DbName);

            path = DictionaryDbPathProvider.GetDbPath(dbId);

            Assert.True(File.Exists(path));
        }
        finally
        {
            if (path is not null) DictionaryDbTestHelper.DeleteDb(path);
        }
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

        var httpClient = factory.CreateClient();
        
        // Act
        var httpResponseMessage = await httpClient.PostAsync("/api/dictionaries/create", null, TestContext.Current.CancellationToken);
        
        // Assert
        Assert.Equal(HttpStatusCode.InternalServerError, httpResponseMessage.StatusCode);

        var problemDetails = await httpResponseMessage.Content.ReadFromJsonAsync<ProblemDetails>(cancellationToken: TestContext.Current.CancellationToken);

        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status500InternalServerError, problemDetails.Status);
        Assert.Equal("An unexpected error occurred.", problemDetails.Title);
    }
}