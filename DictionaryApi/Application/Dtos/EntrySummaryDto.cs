namespace Application.Dtos;

public class EntrySummaryDto
{
    public int Id { get; set; }
    
    public required string Term { get; set; }
    
    public string? Pronunciation { get; set; }
    
    public string? PartOfSpeech { get; set; }
    
    public string? Meaning { get; set; }
    
    public bool IsFavorite { get; set; }

    public CategoryDto Category { get; set; } = null!;
}