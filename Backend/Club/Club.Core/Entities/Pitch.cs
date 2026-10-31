using Club.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Club.Core.Entities
{
    public class Pitch
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int Number { get; set; }
        // unique

        [Required]
        public PitchType Type { get; set; }
        // Football | Basketball | Padel

        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerHour { get; set; }

        public bool IsAvailable { get; set; } = true;

        public string? Description { get; set; }

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
