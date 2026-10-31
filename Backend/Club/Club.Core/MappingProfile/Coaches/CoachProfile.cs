using AutoMapper;
using Club.Core.Dtos.Coach;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Coaches
{
    public class CoachProfile : Profile
    {
        public CoachProfile()
        {
            // Coach -> CoachDto
            CreateMap<Coach, CoachDto>()
                .ForMember(d => d.UserName,
                    o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Email,
                    o => o.MapFrom(s => s.AppUser.Email))
                .ForMember(d => d.PhoneNumber,
                    o => o.MapFrom(s => s.AppUser.PhoneNumber))
                .ForMember(d => d.FullName,
                    o => o.MapFrom(s => s.AppUser.UserProfile!.FullName))
                .ForMember(d => d.Address,
                    o => o.MapFrom(s => s.AppUser.UserProfile!.Address))
                .ForMember(d => d.ImageUrl,
                    o => o.MapFrom(s => s.AppUser.UserProfile!.ImageUrl));

            // Create DTO -> Entities
            CreateMap<CreateCoachDto, AppUser>();

            CreateMap<CreateCoachDto, UserProfile>();

            CreateMap<CreateCoachDto, Coach>()
                .ForMember(d => d.AppUserId, o => o.Ignore())
                .ForMember(d => d.AppUser, o => o.Ignore())
                .ForMember(d => d.Teams, o => o.Ignore())
                .ForMember(d => d.Activities, o => o.Ignore())
                .ForMember(d => d.Bookings, o => o.Ignore());

            // Update DTO -> Entities
            CreateMap<UpdateCoachDto, Coach>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateCoachDto, AppUser>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateCoachDto, UserProfile>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
