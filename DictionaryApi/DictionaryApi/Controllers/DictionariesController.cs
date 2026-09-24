using System.Diagnostics;
using Application.Dtos;
using Application.Errors;
using Application.Services;
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
    public async Task<DictionaryDto> Create()
    {
        return await _dictionaryService.CreateAsync();
    }

    [HttpGet("download")]
    public IActionResult Download()
    {
        var dbId = _dictionaryContext.DbId;
        
        if (dbId == Guid.Empty) return Problem(
            statusCode: StatusCodes.Status400BadRequest,
            title: "No dictionary selected",
            detail: "No dictionary is currently selected. Please create or open a dictionary."
        );

        var result = _dictionaryService.CreateBackupStream(dbId);
        
        if (!result.IsSuccess)
        {
            var error = result.Error;
            return error.Type switch
            {
                ErrorType.NotFound => Problem(
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Dictionary not found",
                    detail: "The dictionary could not be found on the server. Please open the dictionary again."
                ),
                _ => throw new UnreachableException($"Result error code: {error.Code}")
            };
        }

        const string fileDownloadName = "dictionary.db";

        return File(
            result.Value,
            "application/vnd.sqlite3",
            fileDownloadName
        );
    }
}