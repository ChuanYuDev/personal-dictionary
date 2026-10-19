using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace DictionaryApi.Swagger;

public class AddDbIdParameterOperationFilter: IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        operation.Parameters ??= new List<IOpenApiParameter>();
        
        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "db-id",
            In = ParameterLocation.Header,
            Description = "The dictionary Id",
            Required = false
        });
    }
}