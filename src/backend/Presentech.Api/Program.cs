using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore; 
using Presentech.DataAccess.Context; 
using Presentech.Api.Extensions;
using Presentech.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Configurar ForwardedHeaders para que Render/proxies pasen correctamente la IP y esquema HTTPS
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddControllers();
builder.Services.AddCustomApiVersioning();
builder.Services.AddCustomAuthentication(builder.Configuration);
builder.Services.AddCustomCors(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddCustomSwagger();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PresentechDbContext>();
    db.Database.Migrate();
}

// ForwardedHeaders debe ir primero para que el resto del pipeline vea el esquema correcto
app.UseForwardedHeaders();

// Swagger siempre habilitado
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "PresenTech API v1");
    options.RoutePrefix = "swagger";
});

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("CorsPolicy");

// NO usar UseHttpsRedirection en Render: el proxy ya maneja HTTPS externamente
// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
