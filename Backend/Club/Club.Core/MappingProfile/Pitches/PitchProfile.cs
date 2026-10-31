using AutoMapper;
using Club.Core.Dtos.Pitch;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Pitches
{
    public class PitchProfile : Profile
    {
        public PitchProfile()
        {
            CreateMap<Pitch, PitchDto>()
                .ForMember(d => d.BookingsCount,
                    o => o.MapFrom(s => s.Bookings.Count));

            CreateMap<CreatePitchDto, Pitch>()
                .ForMember(d => d.IsAvailable,
                    o => o.MapFrom(s => s.IsAvailable ?? true))
                .ForMember(d => d.Bookings, o => o.Ignore());

            CreateMap<UpdatePitchDto, Pitch>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}