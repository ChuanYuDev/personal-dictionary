using Application.Dtos;

namespace Application.Abstractions;

public interface ICategoryRepository
{
    Task<List<CategoryDto>> GetAsync();
}