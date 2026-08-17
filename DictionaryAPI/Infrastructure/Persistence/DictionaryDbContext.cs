using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DictionaryDbContext: DbContext
{
    public DictionaryDbContext(DbContextOptions options) : base(options) { }
    
    public DbSet<Category> Categories { get; set; }
    public DbSet<Entry> Entries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>().HasData(
            new Category {Id = 1, Name = "word"},
            new Category {Id = 2, Name = "phrase"}
        );
    }
}