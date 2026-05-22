using MediatR;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SkillSwap.Application.Common.Interfaces;
using SkillSwap.Application.Tasks.Commands.CreateTask;
using SkillSwap.Application.Tasks.Queries.SearchTasksByLocation;
using SkillSwap.Infrastructure.Persistence;
using SkillSwap.Infrastructure.Spatial;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure and DB Context with NetTopologySuite support for PostGIS
builder.Services.AddDbContext<SkillSwapDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        o => o.UseNetTopologySuite()
    ));

builder.Services.AddScoped<ISkillSwapDbContext>(provider => 
    provider.GetRequiredService<SkillSwapDbContext>());

// 2. Add spatial services
builder.Services.AddScoped<IGeoSearchService, PostGisGeoSearchService>();

// 3. Register MediatR from Application layer
builder.Services.AddMediatR(cfg => 
    cfg.RegisterServicesFromAssembly(typeof(SkillSwap.Application.Class1).Assembly));

// 4. Add CORS for Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://porsev.space")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 5. Add OpenAPI support
builder.Services.AddOpenApi();

var app = builder.Build();

// 6. Automatically run EF database migrations on startup for ease of deployment
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SkillSwapDbContext>();
    await dbContext.Database.MigrateAsync();
}

// 7. Middlewares
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// 8. Minimal API Endpoints mapped to MediatR Queries/Commands
app.MapGet("/api/tasks/nearby", async (
    double latitude, 
    double longitude, 
    double radiusInMeters, 
    IMediator mediator, 
    CancellationToken cancellationToken) =>
{
    var query = new SearchTasksByLocationQuery(latitude, longitude, radiusInMeters);
    var result = await mediator.Send(query, cancellationToken);
    return Results.Ok(result);
})
.WithName("GetNearbyTasks")
.WithOpenApi();

app.MapPost("/api/tasks", async (
    CreateTaskCommand command, 
    IMediator mediator, 
    CancellationToken cancellationToken) =>
{
    var result = await mediator.Send(command, cancellationToken);
    return Results.Ok(result);
})
.WithName("CreateTask")
.WithOpenApi();

app.Run();
