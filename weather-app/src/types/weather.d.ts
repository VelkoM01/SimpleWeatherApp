export interface WeatherData {
    main: {
      temp: number;
      humidity: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    clouds: {
      all: number;
    };
  }
  
  export interface ForecastItem {
    dt: number;
    dt_txt: string;
    pop: number;
    main: {
      temp: number;
      humidity: number;
      feels_like: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    clouds: {
      all: number;
    };
  }
  