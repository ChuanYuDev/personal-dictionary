namespace Application.Abstractions;

public interface IDictionaryDbManager
{
    bool DictionaryExists(Guid dbId);
    
    Task CreateAsync(Guid dbId, string defaultName);
    
    string CreateBackup(Guid dbId);

    Task<bool> SaveAsync(Guid dbId, Stream sourceStream);
}