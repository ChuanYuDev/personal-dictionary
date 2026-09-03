using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Entry
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(maximumLength: 300)]
    public required string Term { get; set; }
    
    [StringLength(maximumLength: 500)]
    public string? Pronunciation { get; set; }
    
    [StringLength(maximumLength: 50)]
    public string? PartOfSpeech { get; set; }
    
    public string? Meaning { get; set; }
    
    public string? Notes { get; set; }
    
    public bool IsFavorite { get; set; }
    
    public int CategoryId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}