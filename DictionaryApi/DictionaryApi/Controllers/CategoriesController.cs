using Application.Abstractions;
using Application.Dtos;
using DictionaryApi.Filters;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Controllers;

[Route("api/categories")]
[ApiController]
[ServiceFilter<ValidateDbIdActionFilter>]
public class CategoriesController: ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoriesController(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [HttpGet]
    public async Task<List<CategoryDto>> GetAsync()
    {
        return await _categoryRepository.GetAsync();
    }
}