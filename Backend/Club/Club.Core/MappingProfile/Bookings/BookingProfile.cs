using AutoMapper;
using Club.Core.Dtos.Booking;
using Club.Core.Entities;

namespace Club.Core.MappingProfile.Bookings
{
    public class BookingProfile : Profile
    {
        public BookingProfile()
        {
            // Booking → BookingDto
            CreateMap<Booking, BookingDto>()
                .ForMember(d => d.MemberName,
                    o => o.MapFrom(s =>
                        s.Member.AppUser.UserProfile != null &&
                        !string.IsNullOrWhiteSpace(s.Member.AppUser.UserProfile.FullName)
                            ? s.Member.AppUser.UserProfile.FullName
                            : s.Member.AppUser.UserName))
                .ForMember(d => d.PitchNumber, o => o.MapFrom(s => s.Pitch.Number))
                .ForMember(d => d.PitchType, o => o.MapFrom(s => s.Pitch.Type.ToString()))
                .ForMember(d => d.PricePerHour, o => o.MapFrom(s => s.Pitch.PricePerHour))
                .ForMember(d => d.CoachName,
                    o => o.MapFrom(s => s.Coach != null
                        ? (s.Coach.AppUser.UserProfile != null &&
                           !string.IsNullOrWhiteSpace(s.Coach.AppUser.UserProfile.FullName)
                            ? s.Coach.AppUser.UserProfile.FullName
                            : s.Coach.AppUser.UserName)
                        : null));

            // CreateBookingDto → Booking
            CreateMap<CreateBookingDto, Booking>()
                .ForMember(d => d.Member, o => o.Ignore())
                .ForMember(d => d.Pitch, o => o.Ignore())
                .ForMember(d => d.Coach, o => o.Ignore());

            // UpdateBookingDto → Booking
            CreateMap<UpdateBookingDto, Booking>()
                .ForMember(d => d.Member, o => o.Ignore())
                .ForMember(d => d.Pitch, o => o.Ignore())
                .ForMember(d => d.Coach, o => o.Ignore())
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}