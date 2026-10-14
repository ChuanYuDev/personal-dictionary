using Application.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

public class CategoryProfile: Profile
{
    public CategoryProfile()
    {
        CreateMap<Category, CategoryDto>();
    }
}