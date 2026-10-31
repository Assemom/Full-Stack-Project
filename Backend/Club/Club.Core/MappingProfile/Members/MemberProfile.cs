using AutoMapper;
using Club.Core.Dtos.Member;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Members
{
    public class MemberProfile : Profile
    {
        public MemberProfile()
        {
            // Member → MemberDto
            CreateMap<Member, MemberDto>()
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
                    o => o.MapFrom(s => s.AppUser.UserProfile!.ImageUrl))
                .ForMember(d => d.TeamName,
                    o => o.MapFrom(s => s.Team != null ? s.Team.Name : null))
                .ForMember(d => d.SubscriptionStatus,
                    o => o.MapFrom(s => s.Subscriptions
                        .OrderByDescending(sub => sub.EndDate)
                        .Select(sub => sub.Status.ToString())
                        .FirstOrDefault()));

            // CreateMemberDto → AppUser
            CreateMap<CreateMemberDto, AppUser>()
                .ForMember(d => d.UserName,
                    o => o.MapFrom(s => string.IsNullOrWhiteSpace(s.UserName) ? s.Email : s.UserName))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Email))
                .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.PhoneNumber));

            // CreateMemberDto → UserProfile
            CreateMap<CreateMemberDto, UserProfile>()
                .ForMember(d => d.FullName, o => o.MapFrom(s => s.FullName))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Address))
                .ForMember(d => d.AppUserId, o => o.Ignore())
                .ForMember(d => d.AppUser, o => o.Ignore());

            // CreateMemberDto → Member
            CreateMap<CreateMemberDto, Member>()
                .ForMember(d => d.AppUserId, o => o.Ignore())
                .ForMember(d => d.AppUser, o => o.Ignore())
                .ForMember(d => d.Team, o => o.Ignore())
                .ForMember(d => d.Subscriptions, o => o.Ignore())
                .ForMember(d => d.Bookings, o => o.Ignore());

            // UpdateMemberDto → Member
            CreateMap<UpdateMemberDto, Member>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));

            // UpdateMemberDto → AppUser
            CreateMap<UpdateMemberDto, AppUser>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));

            // UpdateMemberDto → UserProfile
            CreateMap<UpdateMemberDto, UserProfile>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
