using Application.Abstractions;
using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class MetadataRepository: IMetadataRepository
{
    private readonly DictionaryDbContext _context;
    private readonly IMapper _mapper;

    public MetadataRepository(DictionaryDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<MetadataDto> GetAsync()
    {
        return await _context.Metadata
            .ProjectTo<MetadataDto>(_mapper.ConfigurationProvider)
            .SingleAsync();
    }

    public async Task UpdateNameAsync(MetadataUpdateDto metadataUpdateDto)
    {
        var metadata = await _context.Metadata.SingleAsync();

        // May modify invalid name later
        _mapper.Map(metadataUpdateDto, metadata);
        
        await _context.SaveChangesAsync();
    }
}