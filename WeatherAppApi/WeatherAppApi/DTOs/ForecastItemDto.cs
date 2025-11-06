namespace WeatherAppApi.Controllers
{
    public partial class WeatherController
    {
        public class ForecastItemDto
        {
            public long Dt { get; set; }
            public Main Main { get; set; }
            public List<Weather> Weather { get; set; }
            public Clouds Clouds { get; set; }
            public Wind Wind { get; set; }
            public string Dt_Txt { get; set; }
            public double Pop { get; set; }
        }
    }

}

