using Application.Abstractions;
using Application.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Services;

public class EntryService
{
    private readonly IEntryRepository _entryRepository;
    private readonly IMapper _mapper;

    public EntryService(IEntryRepository entryRepository, IMapper mapper)
    {
        _entryRepository = entryRepository;
        _mapper = mapper;
    }

    public async Task<EntryDto> CreateAsync(EntryCreationDto entryCreationDto)
    {
        var entry = _mapper.Map<Entry>(entryCreationDto);

        await _entryRepository.CreateAsync(entry);

        return _mapper.Map<EntryDto>(entry);
    }
}