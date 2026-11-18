namespace DictionaryApi.Middleware;

public class DictionaryContextMiddleware
{
    private readonly RequestDelegate _next;
    private const string DbIdHeaderKey = "db-id";

    public DictionaryContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, DictionaryContext dictionaryContext)
    {
        if (!context.Request.Headers.TryGetValue(DbIdHeaderKey, out var value)) dictionaryContext.DbIdStatus = DbIdStatus.Missing;
        else if (!Guid.TryParse(value, out var dbId)) dictionaryContext.DbIdStatus = DbIdStatus.Invalid;
        else
        {
            dictionaryContext.DbId = dbId;
            dictionaryContext.DbIdStatus = DbIdStatus.Valid;
        }
        
        await _next(context);
    }
}