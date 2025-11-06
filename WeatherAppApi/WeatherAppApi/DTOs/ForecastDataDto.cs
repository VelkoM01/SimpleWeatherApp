namespace WeatherAppApi.Controllers
{
    public partial class WeatherController
    {
        // DTOs for the Forecast API responses (5-day forecast structure)
        public class ForecastDataDto
        {
            public List<ForecastItemDto> List { get; set; }
        }
    }

}

