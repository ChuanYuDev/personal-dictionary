using Application.Abstractions;
using Application.Dtos;

namespace Application.Services;

public class DictionaryService
{
    private readonly IDictionaryDbManager _dictionaryDbManager;
    private const string DefaultName = "Untitled Dictionary";

    public DictionaryService(IDictionaryDbManager dictionaryDbManager)
    {
        _dictionaryDbManager = dictionaryDbManager;
    }

    public async Task<DictionaryDto> CreateAsync()
    {
        var dbId = Guid.NewGuid();

        await _dictionaryDbManager.CreateAsync(dbId, DefaultName);

        return new DictionaryDto(dbId, DefaultName);
    }
}