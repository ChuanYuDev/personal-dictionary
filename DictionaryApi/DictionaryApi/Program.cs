using Application.Abstractions;
using Application.Mappings;
using Application.Services;
using DictionaryApi.ExceptionHandling;
using DictionaryApi.Filters;
using DictionaryApi.Middleware;
using DictionaryApi.Swagger;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.OperationFilter<AddDbIdParameterOperationFilter>();
});

var allowedOrigins = builder.Configuration.GetValue<string>("AllowedOrigins")?.Split(",") ?? throw new InvalidOperationException("Allowed origins are not found.");

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader().WithExposedHeaders("total-count");
    });
});

builder.Services.AddOutputCache(options =>
{
    options.DefaultExpirationTimeSpan = TimeSpan.FromSeconds(60);
});

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddTransient<IDictionaryDbManager, DictionaryDbManager>();
builder.Services.AddTransient<IEntryRepository, EntryRepository>();
builder.Services.AddTransient<DictionaryService>();

builder.Services.AddScoped<DictionaryContext>();
builder.Services.AddScoped<IDictionaryContext>(serviceProvider => serviceProvider.GetRequiredService<DictionaryContext>());

builder.Services.AddScoped<ValidateDbIdActionFilter>();

builder.Services.AddDictionaryDbContext(serviceProvider =>
{
    var dictionaryContext = serviceProvider.GetRequiredService<IDictionaryContext>();
    return dictionaryContext.DbId;
});

var autoMapperLicenseKey = builder.Configuration.GetValue<string>("AutoMapperLicenseKey") ?? throw new InvalidOperationException("AutoMapper license key not found");

builder.Services.AddAutoMapper(cfg =>
{
    cfg.LicenseKey = autoMapperLicenseKey;
}, typeof(EntryProfile).Assembly);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

app.UseExceptionHandler("/api/error");

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors();

app.UseDictionaryContext();

app.UseOutputCache();

app.UseAuthorization();

app.MapControllers();

app.Run();