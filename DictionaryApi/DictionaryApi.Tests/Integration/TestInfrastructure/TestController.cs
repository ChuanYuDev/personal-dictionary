using DictionaryApi.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace DictionaryApi.Tests.Integration.TestInfrastructure;

[Route("api/test")]
[ApiController]
public class TestController: ControllerBase
{
    private readonly IDictionaryContext _dictionaryContext;

    public TestController(IDictionaryContext dictionaryContext)
    {
        _dictionaryContext = dictionaryContext;
    }

    [HttpGet("dictionary-context")]
    public Guid Get()
    {
        return _dictionaryContext.DbId;
    }
}