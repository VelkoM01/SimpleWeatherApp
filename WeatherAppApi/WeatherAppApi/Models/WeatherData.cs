namespace WeatherAppApi.Models
{
    public class WeatherData
    {
        public int Id { get; set; }
        public string City { get; set; }
        public double Temperature { get; set; }
        public int Humidity { get; set; }
        public double WindSpeed { get; set; }
        public int Cloudiness { get; set; }
        public DateTime Date { get; set; }
    }
}
