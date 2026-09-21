namespace DictionaryApi.Middleware;

public static class DictionaryContextMiddlewareExtensions
{
    public static IApplicationBuilder UseDictionaryContext(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<DictionaryContextMiddleware>();
    }
}