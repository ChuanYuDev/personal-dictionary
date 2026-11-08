namespace Application.Dtos;

public class PaginationDto
{
    public bool Paginate { get; set; } = true;
    public int Page { get; set; } = 1;

    private int _recordsPerPage = 10;
    private const int MaxRecordsPerPage = 50;

    public int RecordsPerPage
    {
        get => _recordsPerPage;
        set => _recordsPerPage = Math.Min(value, MaxRecordsPerPage);
    }
}