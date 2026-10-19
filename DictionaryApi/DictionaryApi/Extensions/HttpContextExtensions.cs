namespace DictionaryApi.Extensions;

public static class HttpContextExtensions
{
    private const string TotalCountKey = "total-count";
    
    public static void AppendTotalCountInHeader(this HttpContext httpContext, int totalCount)
    {
        httpContext.Response.Headers.Append(TotalCountKey, totalCount.ToString());
    }
}