using Application.Abstractions;
using Application.Common;
using Application.Dtos;
using Application.Errors;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public class DictionaryService
{
    private readonly IDictionaryDbManager _dictionaryDbManager;
    private readonly IDictionaryRepository _dictionaryRepository;
    private readonly ILogger<DictionaryService> _logger;
    private const string DefaultDbName = "Untitled Dictionary";

    public DictionaryService(IDictionaryDbManager dictionaryDbManager, IDictionaryRepository dictionaryRepository, ILogger<DictionaryService> logger)
    {
        _dictionaryDbManager = dictionaryDbManager;
        _dictionaryRepository = dictionaryRepository;
        _logger = logger;
    }

    public async Task<DictionaryDto> CreateAsync()
    {
        var dbId = Guid.NewGuid();

        await _dictionaryDbManager.CreateAsync(dbId, DefaultDbName);
        
        _logger.LogInformation("Dictionary created. DbId: {DbId}", dbId);

        return new DictionaryDto(dbId, DefaultDbName);
    }

    public Stream CreateBackupStream(Guid dbId)
    {
        var backupPath = _dictionaryDbManager.CreateBackup(dbId);

        var stream = new FileStream(
            backupPath,
            FileMode.Open, FileAccess.Read, FileShare.Read,
            bufferSize: 4096,
            FileOptions.DeleteOnClose);
        
        _logger.LogInformation("Dictionary backup created for download. DbId: {DbId}", dbId);

        return stream;
    }

    public async Task<Result<DictionaryDto>> SaveAsync(Stream dbStream)
    {
        var dbId = Guid.NewGuid();
        var dbName = await _dictionaryDbManager.SaveAsync(dbId, dbStream);

        if (dbName is null) return DictionaryErrors.Invalid;
        
        _logger.LogInformation("Dictionary saved. DbId: {DbId}", dbId);

        return new DictionaryDto(dbId, dbName);
    }

    public async Task<DictionaryDto> UpdateNameAsync(Guid dbId, DictionaryUpdateDto dictionaryUpdateDto)
    {
        var name = dictionaryUpdateDto.Name;
        var dbName = await _dictionaryRepository.UpdateNameAsync(name);
        
        _logger.LogInformation("Dictionary name updated. DbId: {DbId}, DbName: {DbName}", dbId, dbName);
        
        return new DictionaryDto(dbId, dbName);
    }
}