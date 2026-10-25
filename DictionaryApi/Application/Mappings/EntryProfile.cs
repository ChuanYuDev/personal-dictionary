using Application.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

public class EntryProfile: Profile
{
    public EntryProfile()
    {
        CreateMap<EntryCreationDto, Entry>();
        CreateMap<Entry, EntrySummaryDto>();
        CreateMap<Entry, EntryDetailsDto>();
    }
}