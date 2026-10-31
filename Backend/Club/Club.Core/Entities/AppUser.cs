using Microsoft.AspNetCore.Identity;

namespace Club.Core.Entities
{
    public class AppUser : IdentityUser
    {
        public UserProfile? UserProfile { get; set; }
    }
}
