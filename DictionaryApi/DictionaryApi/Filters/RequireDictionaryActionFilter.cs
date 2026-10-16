using DictionaryApi.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DictionaryApi.Filters;

public class RequireDictionaryActionFilter: IActionFilter
{
    private readonly IDictionaryContext _dictionaryContext;

    public RequireDictionaryActionFilter(IDictionaryContext dictionaryContext)
    {
        _dictionaryContext = dictionaryContext;
    }
    
    public void OnActionExecuting(ActionExecutingContext context)
    {
        var dbId = _dictionaryContext.DbId;

        if (dbId != Guid.Empty) return;

        context.Result = new ObjectResult(new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "No dictionary selected",
            Detail = "No dictionary is currently selected. Please create or open a dictionary."
        }); 
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}