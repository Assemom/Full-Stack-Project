using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Auth;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Auth
{
    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            CreateMap<RegisterDto, AppUser>();
            CreateMap<AppUser, UserDto>();
        }
    }
}
