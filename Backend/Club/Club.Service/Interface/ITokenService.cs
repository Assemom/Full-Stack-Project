using Club.Core.Entities;

namespace Club.Service.Interface
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(AppUser user);
    }
}
