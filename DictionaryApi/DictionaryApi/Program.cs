using Application.Abstractions;
using Application.Services;
using DictionaryApi.ExceptionHandling;
using DictionaryApi.Middleware;
using Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigins = builder.Configuration.GetValue<string>("AllowedOrigins")?.Split(",") ?? throw new InvalidOperationException("Allowed origins are not found.");

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddTransient<IDictionaryDbManager, DictionaryDbManager>();
builder.Services.AddTransient<DictionaryService>();

builder.Services.AddScoped<DictionaryContext>();
builder.Services.AddScoped<IDictionaryContext>(provider => provider.GetRequiredService<DictionaryContext>());

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

app.UseAuthorization();

app.MapControllers();

app.Run();