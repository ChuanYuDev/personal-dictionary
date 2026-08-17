using Application.Abstractions;

namespace Application.Services;

public class DictionaryService
{
    private readonly IDictionaryDbManager _dictionaryDbManager;

    public DictionaryService(IDictionaryDbManager dictionaryDbManager)
    {
        _dictionaryDbManager = dictionaryDbManager;
    }

    public async Task<Guid> CreateAsync()
    {
        var dbId = Guid.NewGuid();

        await _dictionaryDbManager.CreateAsync(dbId);

        return dbId;
    }
}