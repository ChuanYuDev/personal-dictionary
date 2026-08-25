using Microsoft.AspNetCore.Diagnostics;

namespace DictionaryAPI.ExceptionHandling;

public class GlobalExceptionHandler: IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Time of occurrence {Time}", DateTime.UtcNow);

        return ValueTask.FromResult(false);
    }
}