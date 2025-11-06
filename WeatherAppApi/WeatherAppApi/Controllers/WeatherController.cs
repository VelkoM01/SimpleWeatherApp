using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WeatherAppApi.Data;
using WeatherAppApi.Models;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace WeatherAppApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class WeatherController : ControllerBase
    {
        private readonly WeatherDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public WeatherController(WeatherDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentWeather([FromQuery] string city)
        {
            string apiKey = _configuration["OpenWeatherMap:ApiKey"];
            string apiUrl = $"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric";

            var response = await _httpClient.GetAsync(apiUrl);

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Failed to retrieve weather data.");
            }

            var data = await response.Content.ReadAsStringAsync();
            var weatherData = JsonSerializer.Deserialize<WeatherDataDto>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return Ok(weatherData);
        }

        [HttpGet("forecast")]
        public async Task<IActionResult> GetWeatherForecast([FromQuery] string city, [FromQuery] string duration = "5")
        {
            string apiKey = _configuration["OpenWeatherMap:ApiKey"];

            string forecastUrl = $"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={apiKey}&units=metric&cnt=40";
            var forecastResponse = await _httpClient.GetAsync(forecastUrl);

            if (!forecastResponse.IsSuccessStatusCode)
            {
                return BadRequest("Failed to retrieve weather forecast.");
            }

            var forecastData = await forecastResponse.Content.ReadAsStringAsync();
            var forecast = JsonSerializer.Deserialize<ForecastDataDto>(forecastData, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (forecast == null || forecast.List == null)
            {
                return BadRequest("Invalid forecast data.");
            }

            foreach (var item in forecast.List)
            {
                var weatherForecast = new WeatherData
                {
                    City = city,
                    Date = DateTimeOffset.FromUnixTimeSeconds(item.Dt).DateTime,
                    Temperature = item.Main.Temp,
                    WindSpeed = item.Wind.Speed,
                    Humidity = item.Main.Humidity,
                    Cloudiness = item.Clouds.All
                };

                var existingForecast = await _context.WeatherData
                    .FirstOrDefaultAsync(f => f.City == city && f.Date == weatherForecast.Date);

                if (existingForecast == null)
                {
                    await _context.WeatherData.AddAsync(weatherForecast);
                }
                else
                {
                    existingForecast.Temperature = weatherForecast.Temperature;
                    existingForecast.WindSpeed = weatherForecast.WindSpeed;
                    existingForecast.Humidity = weatherForecast.Humidity;
                    existingForecast.Cloudiness = weatherForecast.Cloudiness;
                }
            }

            await _context.SaveChangesAsync();

            var now = DateTimeOffset.Now;
            var startOfToday = new DateTimeOffset(now.Year, now.Month, now.Day, 0, 0, 0, now.Offset).ToUnixTimeSeconds();
            var endOfToday = startOfToday + 86400;

            List<ForecastItemDto> result;

            switch (duration)
            {
                case "today":
                    result = forecast.List
                        .Where(f => f.Dt >= startOfToday && f.Dt < endOfToday)
                        .ToList();
                    break;

                case "3":
                    var threeDaysLater = now.AddDays(3).ToUnixTimeSeconds();
                    result = forecast.List
                        .Where(f => f.Dt >= now.ToUnixTimeSeconds() && f.Dt < threeDaysLater)
                        .ToList();
                    break;

                case "5":
                default:
                    result = forecast.List.ToList();
                    break;
            }

            return Ok(result);
        }

        [HttpPost("favorites")]
        public async Task<IActionResult> AddFavoriteLocation([FromBody] FavoriteLocation favorite)
        {
            _context.FavoriteLocations.Add(favorite);
            await _context.SaveChangesAsync();
            return Ok(favorite);
        }

        [HttpDelete("favorites/{id}")]
        public async Task<IActionResult> RemoveFavoriteLocation(int id)
        {
            var favorite = await _context.FavoriteLocations.FindAsync(id);
            if (favorite == null)
            {
                return NotFound("Favorite location not found.");
            }

            _context.FavoriteLocations.Remove(favorite);
            await _context.SaveChangesAsync();
            return Ok("Favorite removed successfully.");
        }

        [HttpGet("favorites")]
        public IActionResult GetFavoriteLocations([FromQuery] string userId)
        {
            var favorites = _context.FavoriteLocations
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.AddedOn)
                .ToList();

            return Ok(favorites);
        }
    }

}

