using AutoMapper;
using Club.Core.Dtos.Subscription;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Subscriptions
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            // Subscription → SubscriptionDto
            CreateMap<Subscription, SubscriptionDto>()
                .ForMember(d => d.MemberName,
                    o => o.MapFrom(s =>
                        s.Member.AppUser.UserProfile != null &&
                        !string.IsNullOrWhiteSpace(s.Member.AppUser.UserProfile.FullName)
                            ? s.Member.AppUser.UserProfile.FullName
                            : s.Member.AppUser.UserName))
                .ForMember(d => d.PlanName, o => o.MapFrom(s => s.Plan.Name))
                .ForMember(d => d.PlanType, o => o.MapFrom(s => s.Plan.Type))
                .ForMember(d => d.PlanPrice, o => o.MapFrom(s => s.Plan.Price))
                .ForMember(d => d.DurationMonths, o => o.MapFrom(s => s.Plan.DurationMonths));

            // CreateSubscriptionDto → Subscription
            CreateMap<CreateSubscriptionDto, Subscription>()
                .ForMember(d => d.Member, o => o.Ignore())
                .ForMember(d => d.Plan, o => o.Ignore())
                .ForMember(d => d.EndDate, o => o.Ignore());

            // UpdateSubscriptionDto → Subscription
            CreateMap<UpdateSubscriptionDto, Subscription>()
                .ForMember(d => d.Member, o => o.Ignore())
                .ForMember(d => d.Plan, o => o.Ignore())
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}