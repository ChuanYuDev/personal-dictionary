namespace Application.Errors;

public static class DictionaryErrors
{
    public static Error NotFound { get; } = new ("Dictionary.NotFound", ErrorType.NotFound, "Dictionary is not found.");
}