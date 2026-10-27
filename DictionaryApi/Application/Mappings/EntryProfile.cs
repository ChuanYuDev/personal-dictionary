using Application.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

public class EntryProfile: Profile
{
    public EntryProfile()
    {
        CreateMap<EntryCreationDto, Entry>();
        CreateMap<Entry, EntrySummaryDto>()
            .ForMember(entrySummaryDto => entrySummaryDto.CategoryName, config =>
            {
                config.MapFrom(entry => entry.Category.Name);
            });

        CreateMap<Entry, EntryDetailsDto>()
            .ForMember(entryDetailsDto => entryDetailsDto.CategoryName, config =>
            {
                config.MapFrom(entry => entry.Category.Name);
            });
    }
}