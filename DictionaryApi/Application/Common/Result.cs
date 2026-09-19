using Application.Errors;

namespace Application.Common;

public class Result
{
    private readonly Error? _error;
    
    public bool IsSuccess { get; }
    public Error Error => IsSuccess? throw new InvalidOperationException("Cannot access the error of a successful result"): _error!;

    protected Result()
    {
        IsSuccess = true;
        _error = null;
    }

    protected Result(Error error)
    {
        IsSuccess = false;
        _error = error;
    }

    public static Result Success() => new();

    public static implicit operator Result(Error error) => new(error);
}

public class Result<T> : Result
{
    private readonly T? _value;

    public T Value =>
        IsSuccess ? _value! : throw new InvalidOperationException("Cannot access the value of a failed result");

    private Result(T value)
    {
        _value = value;
    }
    
    private Result(Error error): base(error) {}

    public static implicit operator Result<T>(T value) => new(value);
    public static implicit operator Result<T>(Error error) => new(error);
}