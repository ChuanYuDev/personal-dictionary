namespace Application.Dtos;

public class EntryFilterDto: PaginationDto
{
    public string? Term { get; set; }
    public int CategoryId { get; set; }
    public bool IsFavorite { get; set; }
}