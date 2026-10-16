using Domain.Entities;

namespace Application.Abstractions;

public interface IEntryRepository
{
    Task CreateAsync(Entry entry);
}