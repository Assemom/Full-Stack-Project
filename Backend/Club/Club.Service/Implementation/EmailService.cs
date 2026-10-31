using Club.Service.Interface;
using Microsoft.Extensions.Logging;

namespace Club.Service.Implementation
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            _logger.LogInformation("Email to {To}: {Subject}\n{Body}", to, subject, body);
            // TODO: Integrate MailKit/Smtp client when SMTP credentials are configured
            return Task.CompletedTask;
        }
    }
}
