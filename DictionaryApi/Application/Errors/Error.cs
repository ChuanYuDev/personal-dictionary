namespace Application.Errors;

public record Error(string Id, ErrorType Type, string Description);