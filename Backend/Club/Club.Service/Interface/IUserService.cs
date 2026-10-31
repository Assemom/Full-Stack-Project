using Club.Core.Dtos;
using Club.Core.Dtos.Auth;

namespace Club.Service.Interface
{
    public interface IUserService
    {
        Task<ApiResponse<UserDto>> LoginAsync(LoginDto dto);
        Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto dto);

        Task<bool> CheckEmailExistAsync(string email);
    }
}
