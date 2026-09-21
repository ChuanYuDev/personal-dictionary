namespace DictionaryApi.Middleware;

public class DictionaryContextMiddleware
{
    private readonly RequestDelegate _next;
    private const string DbIdHeaderKey = "X-DbId";

    public DictionaryContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, DictionaryContext dictionaryContext)
    {
        if (context.Request.Headers.TryGetValue(DbIdHeaderKey, out var value) &&
            Guid.TryParse(value, out var dbId)) dictionaryContext.DbId = dbId;
        
        await _next(context);
    }
}