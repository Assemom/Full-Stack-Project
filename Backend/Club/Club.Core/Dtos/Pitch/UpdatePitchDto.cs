using Club.Core.Enums;

namespace Club.Core.Dtos.Pitch
{
    public class UpdatePitchDto
    {
        public int? Number { get; set; }
        public PitchType? Type { get; set; }
        public decimal? PricePerHour { get; set; }
        public bool? IsAvailable { get; set; }
        public string? Description { get; set; }
    }
}