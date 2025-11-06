using Microsoft.EntityFrameworkCore;
using WeatherAppApi.Models;

namespace WeatherAppApi.Data
{
    public class WeatherDbContext : DbContext
    {
        public WeatherDbContext(DbContextOptions<WeatherDbContext> options) : base(options) { }

        public DbSet<WeatherData> WeatherData { get; set; }
        public DbSet<FavoriteLocation> FavoriteLocations { get; set; }
    }
}
