using AutoMapper;
using Club.Core.Dtos.JoinRequests;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.JoinRequests
{
    public class JoinRequestProfile : Profile
    {
        public JoinRequestProfile()
        {
            CreateMap<JoinRequest, JoinRequestDto>()
                .ForMember(d => d.MemberName,
                    o => o.MapFrom(s => s.Member.AppUser.UserProfile != null
                        ? s.Member.AppUser.UserProfile.FullName
                        : s.Member.AppUser.UserName))
                .ForMember(d => d.MemberEmail,
                    o => o.MapFrom(s => s.Member.AppUser.Email))
                .ForMember(d => d.TeamName,
                    o => o.MapFrom(s => s.Team != null ? s.Team.Name : null))
                .ForMember(d => d.ActivityName,
                    o => o.MapFrom(s => s.Activity != null ? s.Activity.Name : null))
                .ForMember(d => d.Status,
                    o => o.MapFrom(s => s.Status.ToString()));

            CreateMap<CreateJoinRequestDto, JoinRequest>()
                .ForMember(d => d.Member, o => o.Ignore())
                .ForMember(d => d.Team, o => o.Ignore())
                .ForMember(d => d.Activity, o => o.Ignore())
                .ForMember(d => d.Status, o => o.Ignore())
                .ForMember(d => d.CreatedAt, o => o.Ignore())
                .ForMember(d => d.RespondedAt, o => o.Ignore())
                .ForMember(d => d.ResponseNote, o => o.Ignore());
        }
    }
}
