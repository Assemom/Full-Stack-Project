using AutoMapper;
using Club.Core.Dtos.Activity;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Activities
{
    public class ActivityProfile : Profile
    {
        public ActivityProfile()
        {
            // Activity → ActivityDto
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.CoachName,
                    o => o.MapFrom(s =>
                        s.Coach.AppUser.UserProfile != null &&
                        !string.IsNullOrWhiteSpace(s.Coach.AppUser.UserProfile.FullName)
                            ? s.Coach.AppUser.UserProfile.FullName
                            : s.Coach.AppUser.UserName))
                .ForMember(d => d.TeamName,
                    o => o.MapFrom(s => s.Team.Name))
                .ForMember(d => d.TeamMembersCount,
                    o => o.MapFrom(s => s.Team.Members.Count));

            // CreateActivityDto → Activity
            CreateMap<CreateActivityDto, Activity>()
                .ForMember(d => d.IsActive,
                    o => o.MapFrom(s => s.IsActive ?? true))
                .ForMember(d => d.Coach, o => o.Ignore())
                .ForMember(d => d.Team, o => o.Ignore());

            // UpdateActivityDto → Activity
            CreateMap<UpdateActivityDto, Activity>()
                .ForMember(d => d.Coach, o => o.Ignore())
                .ForMember(d => d.Team, o => o.Ignore())
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}