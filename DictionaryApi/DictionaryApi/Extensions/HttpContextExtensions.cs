namespace DictionaryApi.Extensions;

public static class HttpContextExtensions
{
    private const string TotalCountKey = "total-count";
    
    public static void AppendTotalCountInHeader(this HttpContext httpContext, int count)
    {
        httpContext.Response.Headers.Append(TotalCountKey, count.ToString());
    }
}