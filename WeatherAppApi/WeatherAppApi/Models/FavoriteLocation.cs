using System.ComponentModel.DataAnnotations;

namespace WeatherAppApi.Models
{
    public class FavoriteLocation
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; } 
        public string City { get; set; } 
        public DateTime AddedOn { get; set; } = DateTime.UtcNow;
    }
}
