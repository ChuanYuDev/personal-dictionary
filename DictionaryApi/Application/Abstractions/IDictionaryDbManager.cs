namespace Application.Abstractions;

public interface IDictionaryDbManager
{
    Task CreateAsync(Guid dbId, string defaultName);
    string? CreateBackup(Guid dbId);
}