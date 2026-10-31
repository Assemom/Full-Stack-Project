using AutoMapper;
using Club.Core.Dtos.Team;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Teams
{
    public class TeamProfile : Profile
    {
        public TeamProfile()
        {
            // Team → TeamDto
            CreateMap<Team, TeamDto>()
                .ForMember(d => d.CoachName,
                    o => o.MapFrom(s => s.Coach != null
                        ? s.Coach.AppUser.UserProfile!.FullName
                        : null))
                .ForMember(d => d.CoachSpecialization,
                    o => o.MapFrom(s => s.Coach != null
                        ? s.Coach.Specialization
                        : null))
                .ForMember(d => d.MembersCount,
                    o => o.MapFrom(s => s.Members.Count));

            // CreateTeamDto → Team
            CreateMap<CreateTeamDto, Team>()
                .ForMember(d => d.Members, o => o.Ignore())
                .ForMember(d => d.Activities, o => o.Ignore())
                .ForMember(d => d.Coach, o => o.Ignore());

            // UpdateTeamDto → Team
            CreateMap<UpdateTeamDto, Team>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
