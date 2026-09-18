namespace Application.Abstractions;

public interface IDictionaryDbManager
{
    public Task CreateAsync(Guid dbId, string defaultName);
    public string? CreateBackup(Guid dbId);
}