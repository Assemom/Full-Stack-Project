namespace Club.Core.Dtos
{
    public class AdminUserDto
    {
        public string Id { get; set; } = default!;
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? PhoneNumber { get; set; }
        public string? FullName { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> Roles { get; set; } = [];
        public bool IsLockedOut { get; set; }
        public DateTime? LockoutEnd { get; set; }
    }
}
