using Application.Abstractions;
using Application.Dtos;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public class DictionaryService
{
    private readonly IDictionaryDbManager _dictionaryDbManager;
    private readonly ILogger<DictionaryService> _logger;
    private const string DefaultDbName = "Untitled Dictionary";

    public DictionaryService(IDictionaryDbManager dictionaryDbManager, ILogger<DictionaryService> logger)
    {
        _dictionaryDbManager = dictionaryDbManager;
        _logger = logger;
    }

    public async Task<DictionaryDto> CreateAsync()
    {
        var dbId = Guid.NewGuid();

        await _dictionaryDbManager.CreateAsync(dbId, DefaultDbName);
        
        _logger.LogInformation("Dictionary created. DbId: {DbId}, Time of occurence: {Time}", dbId, DateTime.UtcNow);

        return new DictionaryDto(dbId, DefaultDbName);
    }
}