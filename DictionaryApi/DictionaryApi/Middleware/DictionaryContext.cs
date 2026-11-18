namespace DictionaryApi.Middleware;

public class DictionaryContext: IDictionaryContext
{
    public Guid DbId { get; set; }
    public DbIdStatus DbIdStatus { get; set; }
}