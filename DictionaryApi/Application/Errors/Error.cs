namespace Application.Errors;

public record Error(string Code, ErrorType Type, string Description);