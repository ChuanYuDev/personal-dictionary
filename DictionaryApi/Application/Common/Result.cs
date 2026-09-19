using Application.Errors;

namespace Application.Common;

public class Result
{
    public bool IsSuccess { get; }
    public Error? Error { get; }

    protected Result()
    {
        IsSuccess = true;
        Error = null;
    }

    protected Result(Error error)
    {
        IsSuccess = false;
        Error = error;
    }

    public static Result Success() => new();

    public static implicit operator Result(Error error) => new(error);
}

public class Result<T> : Result
{
    public T? Value { get; }

    private Result(T value)
    {
        Value = value;
    }
    
    private Result(Error error): base(error) {}

    public static implicit operator Result<T>(T value) => new(value);
    public static implicit operator Result<T>(Error error) => new(error);
}