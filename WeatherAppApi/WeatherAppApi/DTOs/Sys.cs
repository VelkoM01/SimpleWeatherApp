namespace WeatherAppApi.Controllers
{
    public partial class WeatherController
    {
        public class Sys
        {
            public int Type { get; set; }
            public int Id { get; set; }
            public string Country { get; set; }
            public long Sunrise { get; set; }
            public long Sunset { get; set; }
        }
    }

}

