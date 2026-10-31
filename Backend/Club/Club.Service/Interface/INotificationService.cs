namespace Club.Service.Interface
{
    public interface INotificationService
    {
        Task NotifyUserAsync(string appUserId, string title, string message, string? link = null);
    }
}
