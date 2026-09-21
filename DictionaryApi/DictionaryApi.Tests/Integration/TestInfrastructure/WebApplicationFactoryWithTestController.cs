using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace DictionaryApi.Tests.Integration.TestInfrastructure;

public class WebApplicationFactoryWithTestController<TProgram>: WebApplicationFactory<TProgram> where TProgram: class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.AddControllers().AddApplicationPart(typeof(TestController).Assembly);
        });
    }
}