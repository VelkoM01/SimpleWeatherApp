namespace WeatherAppApi.Controllers
{
    public partial class WeatherController
    {
        // DTOs for the API responses
        public class WeatherDataDto
        {
            public Coord Coord { get; set; }
            public List<Weather> Weather { get; set; }
            public string Base { get; set; }
            public Main Main { get; set; }
            public int Visibility { get; set; }
            public Wind Wind { get; set; }
            public Clouds Clouds { get; set; }
            public long Dt { get; set; }
            public Sys Sys { get; set; }
            public int Timezone { get; set; }
            public int Id { get; set; }
            public string Name { get; set; }
            public int Cod { get; set; }
        }
    }

}

