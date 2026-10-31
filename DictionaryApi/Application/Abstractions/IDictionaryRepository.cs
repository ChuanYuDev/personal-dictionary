using Application.Dtos;

namespace Application.Abstractions;

public interface IDictionaryRepository
{
    Task<string> UpdateNameAsync(string name);
}