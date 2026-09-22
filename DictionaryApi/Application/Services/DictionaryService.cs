using Application.Abstractions;
using Application.Common;
using Application.Dtos;
using Application.Errors;
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
        
        _logger.LogInformation("Dictionary created. DbId: {DbId}", dbId);

        return new DictionaryDto(dbId, DefaultDbName);
    }

    public Result<Stream> CreateBackupStream(Guid dbId)
    {
        var backupPath = _dictionaryDbManager.CreateBackup(dbId);

        if (backupPath is null) return DictionaryErrors.NotFound;

        var stream = new FileStream(
            backupPath,
            FileMode.Open, FileAccess.Read, FileShare.Read,
            bufferSize: 4096,
            FileOptions.DeleteOnClose);
        
        _logger.LogInformation("Dictionary backup created for download. DbId: {DbId}", dbId);

        return stream;
    }
}