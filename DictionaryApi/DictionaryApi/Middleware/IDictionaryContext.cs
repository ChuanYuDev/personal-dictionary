namespace DictionaryApi.Middleware;

public interface IDictionaryContext
{
    Guid DbId { get; }
    DbIdStatus DbIdStatus { get; }
}