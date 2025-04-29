"use client";
import { useEffect, useState } from "react";
import { getWeatherByCity, getForecastByCity } from "./api/weather";

export default function Home() {
  const [city, setCity] = useState("Улаанбаатар");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  const fetchWeather = async () => {
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);

      const forecastData = await getForecastByCity(city);
      // 5 өдрийн 3 цаг тутмын мэдээллээс өдөрт 1-ийг сонгоё
      const filteredForecast = forecastData.list.filter((_: any, index: number) => index % 8 === 0);
      setForecast(filteredForecast);
    } catch (error) {
      alert("Алдаа гарлаа: " + error);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center flex-col"
      style={{ backgroundImage: `url('/img/bg.jpg')` }}
    >
      {/* Хайх хэсэг */}
      <div className="w-[1000px] h-[50px] bg-gray-400/60 rounded-3xl mt-10 px-10">
        <input
          type="text"
          className="outline-none w-full h-full bg-transparent text-white placeholder-white"
          placeholder="Хайх..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
      </div>

      {/* Контент */}
      <div className="flex flex-row mt-20">
        {/* Зүүн тал */}
        <div className="w-[400px] h-[300px] bg-gray-400/60 rounded-3xl text-white p-4">
          {weather ? (
            <>
              <h2 className="text-xl font-bold">{weather.name}</h2>
              <p>{weather.weather[0].description}</p>
              <p>Температур: {weather.main.temp}°C</p>
              <p>Салхи: {weather.wind.speed} м/с</p>
              <p>Чийгшил: {weather.main.humidity}%</p>
            </>
          ) : (
            <p>Уншиж байна...</p>
          )}
        </div>

        {/* Баруун тал */}
        <div className="w-[1200px] h-[600px] flex flex-wrap gap-4 bg-gray-400/60 rounded-3xl ml-10 p-10 text-white">
          {forecast.map((item, index) => (
            <div key={index} className="w-[200px] h-[100px] bg-white/60 rounded-xl p-2 text-black">
              <p className="font-semibold">{item.dt_txt.split(" ")[0]}</p>
              <p>{item.weather[0].description}</p>
              <p>{item.main.temp}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
