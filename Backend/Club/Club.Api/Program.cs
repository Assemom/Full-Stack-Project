using Club.Api.Hubs;
using Club.Api.Middleware;
using Club.Api.Services;
using Club.Api.Swagger;
using Club.Core.Dtos;
using Club.Core.Entities;
using Club.Core.MappingProfile.Activities;
using Club.Core.MappingProfile.Auth;
using Club.Core.MappingProfile.Bookings;
using Club.Core.MappingProfile.Coaches;
using Club.Core.MappingProfile.JoinRequests;
using Club.Core.MappingProfile.Members;
using Club.Core.MappingProfile.Pitches;
using Club.Core.MappingProfile.Plans;
using Club.Core.MappingProfile.Subscriptions;
using Club.Core.MappingProfile.Teams;
using Club.Repository.Data;
using Club.Repository.Data.Context;
using Club.Repository.Implementation;
using Club.Repository.Interface;
using Club.Service.Implementation;
using Club.Service.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

namespace Club.Api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            // Api Response to match my apiresponse format 
            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState
                        .Where(e => e.Value?.Errors.Count > 0)
                        .SelectMany(e => e.Value!.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToArray();

                    var response = ApiResponse<string>.Fail("Validation failed.", errors);
                    return new BadRequestObjectResult(response);
                };
            });

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("FrontendDev", policy =>
                {
                    policy.WithOrigins(
                            "http://localhost:5173",
                            "https://localhost:5173",
                            "http://localhost:3000",
                            "https://localhost:3000",
                            "http://localhost:4200",
                            "https://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            //connect the database one for the tables and other for identity
            builder.Services.AddDbContext<ClubContext>(op =>
            op.UseSqlServer(builder.Configuration.GetConnectionString("defaultconnection")));

            // ─── Identity using ClubContext ───────────────────────────
            builder.Services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<ClubContext>()
                .AddDefaultTokenProviders();

            //Auth Schema and validation of jwt
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],

                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
                    )
                };
            });

            //rate limiting for login
            builder.Services.AddRateLimiter(options =>
            {
                options.AddFixedWindowLimiter("LoginPolicy", opt =>
                {
                    opt.PermitLimit = 10;
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    opt.QueueLimit = 0;
                });
            });

            //configure swagger To use token 
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Club API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT Token"
                });

                options.OperationFilter<JwtAuthOperationFilter>();
            });

            //DI
            builder.Services.AddAutoMapper(m => m.AddProfile(new AuthProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new CoachProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new TeamProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new MemberProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new PlanProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new SubscriptionProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new PitchProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new ActivityProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new BookingProfile()));
            builder.Services.AddAutoMapper(m => m.AddProfile(new JoinRequestProfile()));
            builder.Services.AddScoped<IFileUploadService, FileUploadService>();
            builder.Services.AddScoped<IMemberService, MemberService>();
            builder.Services.AddScoped<IContactService, ContactService>();
            builder.Services.AddScoped<IJoinRequestService, JoinRequestService>();
            builder.Services.AddScoped<ITeamService, TeamService>();
            builder.Services.AddScoped<ITokenService, TokenService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<ICoachService, CoachService>();
            builder.Services.AddScoped<IPlanService, PlanService>();
            builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
            builder.Services.AddScoped<IPitchService, PitchService>();
            builder.Services.AddScoped<IActivityService, ActivityService>();
            builder.Services.AddScoped<IBookingService, BookingService>();
            builder.Services.AddScoped<IDashboardService, DashboardService>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<INotificationService, Api.Services.NotificationService>();
            builder.Services.AddSignalR();

            var app = builder.Build();

            //seed data
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                var userManager =
                    services.GetRequiredService<UserManager<AppUser>>();

                var roleManager =
                    services.GetRequiredService<RoleManager<IdentityRole>>();

                await SeedData.SeedAdminAsync(
                    userManager,
                    roleManager);
            }

            //seed roles
            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var roles = new[] { "Admin", "Coach", "Member" };

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            //add my exception handler to the middleware
            app.UseMiddleware<ExceptionHandlingMiddleware>();

            app.UseCors("FrontendDev");

            app.UseRateLimiter();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapHub<NotificationHub>("/hubs/notifications");

            app.MapControllers();

            app.Run();
        }
    }
}
