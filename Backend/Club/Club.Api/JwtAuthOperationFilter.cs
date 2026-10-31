using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Club.Api.Swagger
{
    public class JwtAuthOperationFilter : IOperationFilter
    {
        public void Apply(
            OpenApiOperation operation,
            OperationFilterContext context)
        {
            var hasAuthorize =
                context.MethodInfo.DeclaringType?
                    .GetCustomAttributes(true)
                    .OfType<Microsoft.AspNetCore.Authorization.AuthorizeAttribute>()
                    .Any() == true
                ||
                context.MethodInfo
                    .GetCustomAttributes(true)
                    .OfType<Microsoft.AspNetCore.Authorization.AuthorizeAttribute>()
                    .Any();

            if (!hasAuthorize)
                return;

            operation.Security ??= [];

            operation.Security.Add(
                new OpenApiSecurityRequirement());
        }
    }
}