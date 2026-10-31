using Club.Api.Hubs;
using Club.Service.Interface;
using Microsoft.AspNetCore.SignalR;

namespace Club.Api.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyUserAsync(string appUserId, string title, string message, string? link = null)
        {
            await _hubContext.Clients.Group(appUserId).SendAsync("ReceiveNotification", new
            {
                title,
                message,
                link,
                createdAt = DateTime.UtcNow,
            });
        }
    }
}
