using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class DictionaryUpdateDto
{
    [Required]
    [StringLength(maximumLength: 50)]
    public required string Name { get; set; }
}