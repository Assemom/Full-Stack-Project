using Club.Core.Enums;

namespace Club.Core.Dtos.Pitch
{
    public class PitchDto
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public PitchType Type { get; set; }
        public decimal PricePerHour { get; set; }
        public bool IsAvailable { get; set; }
        public string? Description { get; set; }

        public int BookingsCount { get; set; }
    }
}