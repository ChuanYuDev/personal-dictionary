namespace Application.Dtos;

public class EntryDetailsDto: EntrySummaryDto
{
    public string? Notes { get; set; }
    
    public int CategoryId { get; set; }
    
    public DateTime ModifiedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}