using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(maximumLength: 50)]
    public required string Name { get; set; }
}