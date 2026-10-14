using System.ComponentModel.DataAnnotations;
using Domain.Entities;

namespace Application.Dtos;

public class EntryCreationDto
{
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
}