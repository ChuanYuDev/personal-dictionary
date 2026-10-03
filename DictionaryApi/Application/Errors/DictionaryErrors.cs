namespace Application.Errors;

public static class DictionaryErrors
{
    public static Error NotFound { get; } = new ("Dictionary.NotFound", ErrorType.NotFound, "Dictionary is not found.");
    public static Error Invalid { get; } = new("Dictionary.Invalid", ErrorType.Invalid, "Dictionary is not valid.");
}