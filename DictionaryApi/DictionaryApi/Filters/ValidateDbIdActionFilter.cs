using Application.Abstractions;
using DictionaryApi.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DictionaryApi.Filters;

public class ValidateDbIdActionFilter: IActionFilter
{
    private readonly IDictionaryContext _dictionaryContext;
    private readonly IDictionaryDbManager _dictionaryDbManager;

    public ValidateDbIdActionFilter(IDictionaryContext dictionaryContext, IDictionaryDbManager dictionaryDbManager)
    {
        _dictionaryContext = dictionaryContext;
        _dictionaryDbManager = dictionaryDbManager;
    }
    
    public void OnActionExecuting(ActionExecutingContext context)
    {
        var dbId = _dictionaryContext.DbId;

        if (dbId == Guid.Empty)
        {
            context.Result = new ObjectResult(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "No dictionary selected",
                Detail = "No dictionary is currently selected. Please create or open a dictionary."
            });
            return;
        }

        if (_dictionaryDbManager.DictionaryExists(dbId)) return;
        
        context.Result = new ObjectResult(new ProblemDetails
        {
            Status = StatusCodes.Status404NotFound,
            Title = "Dictionary not found",
            Detail = "The dictionary could not be found on the server. Please create or open a dictionary."
        });
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}