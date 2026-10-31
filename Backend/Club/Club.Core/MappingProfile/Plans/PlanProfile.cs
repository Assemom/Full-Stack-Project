using AutoMapper;
using Club.Core.Dtos.Plan;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Plans
{
    public class PlanProfile : Profile
    {
        public PlanProfile()
        {
            // Plan → PlanDto
            CreateMap<Plan, PlanDto>()
                .ForMember(d => d.SubscriptionsCount,
                    o => o.MapFrom(s => s.Subscriptions.Count));

            // CreatePlanDto → Plan
            CreateMap<CreatePlanDto, Plan>()
                .ForMember(d => d.IsActive,
                    o => o.MapFrom(s => s.IsActive ?? true))
                .ForMember(d => d.Subscriptions, o => o.Ignore());

            // UpdatePlanDto → Plan
            CreateMap<UpdatePlanDto, Plan>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}