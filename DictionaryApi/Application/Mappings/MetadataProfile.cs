using Application.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

public class MetadataProfile: Profile
{
    public MetadataProfile()
    {
        CreateMap<Metadata, MetadataDto>();
        CreateMap<MetadataUpdateDto, Metadata>();
    }
}