using Club.Core.Dtos;
using System.Net;
using System.Text.Json;

namespace Club.Api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // Log full exception chain including inner exceptions
                _logger.LogError(ex, "Exception: {Message}", ex.Message);
                if (ex.InnerException != null)
                    _logger.LogError("Inner Exception: {Message}", ex.InnerException.Message);
                if (ex.InnerException?.InnerException != null)
                    _logger.LogError("Inner Inner Exception: {Message}", ex.InnerException.InnerException.Message);

                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = ApiResponse<object>.Fail(
                "Something went wrong on our end. Please try again or contact support."
            );

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }
}