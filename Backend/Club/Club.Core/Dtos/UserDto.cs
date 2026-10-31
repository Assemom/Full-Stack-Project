namespace Club.Core.Dtos
{
    public class UserDto
    {
        public string Id { get; set; } = default!;
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
    }
}
