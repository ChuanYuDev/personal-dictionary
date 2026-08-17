namespace Application.Abstractions;

public interface IDictionaryDbManager
{
    public Task CreateAsync(Guid dbId);

}