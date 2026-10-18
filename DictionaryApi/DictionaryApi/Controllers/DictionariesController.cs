using System.Diagnostics;
using Application.Dtos;
using Application.Errors;
using Application.Services;
using DictionaryApi.Filters;
using DictionaryApi.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Controllers;

[Route("api/dictionaries")]
[ApiController]
public class DictionariesController: ControllerBase
{
    private readonly DictionaryService _dictionaryService;
    private readonly IDictionaryContext _dictionaryContext;

    public DictionariesController(DictionaryService dictionaryService, IDictionaryContext dictionaryContext)
    {
        _dictionaryService = dictionaryService;
        _dictionaryContext = dictionaryContext;
    }
    
    [HttpPost("create")]
    public async Task<DictionaryDto> CreateAsync()
    {
        return await _dictionaryService.CreateAsync();
    }

    [HttpGet("download")]
    [ServiceFilter<ValidateDbIdActionFilter>]
    public IActionResult Download()
    {
        var dbId = _dictionaryContext.DbId;
        
        var backupStream = _dictionaryService.CreateBackupStream(dbId);

        return File(backupStream, "application/vnd.sqlite3");
    }

    [HttpPost("open")]
    public async Task<ActionResult<DictionaryDto>> OpenAsync()
    {
        var stream = Request.Body;
        var result = await _dictionaryService.SaveAsync(stream);

        if (result.IsSuccess) return result.Value;

        var error = result.Error;

        return error.Type switch
        {
            ErrorType.Invalid => Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Dictionary invalid",
                detail: "The selected file is not valid dictionary. Please open another dictionary."
            ),
            _ => throw new UnreachableException($"Result error code: {error.Code}")
        };
    }
}