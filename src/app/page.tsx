"use client";
import { useEffect, useState } from "react";
import { getWeatherByCity, getForecastByCity } from "./api/weather";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"

export default function Home() {
  const [city, setCity] = useState("Улаанбаатар");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const fetchWeather = async () => {
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);

      const forecastData = await getForecastByCity(city);
      console.log(forecastData)

      const filteredForecast = forecastData.list.filter((_: any, index: number) => index % 8 === 0);
      console.log(filteredForecast)
      
      setForecast(filteredForecast);
    } catch (error) {
      toast("Олдсонгүй", {
        description: "Та хотын нэрээ дахин шалгаад оруулна уу",
        action: {
          label: "Дахин оролдоно уу",
          onClick: () => console.log("Дахин оролдоно уу"), 
        },
      });

    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    
    <div
      className="w-full h-screen bg-cover bg-center flex items-center flex-col"
      style={{ backgroundImage: `url('/img/background2.jpg')` }}
    >

      <div className="w-[1000px] h-[50px] flex items-center bg-gray-400/60 rounded-3xl mt-10 px-10">
 
        <input
          type="text"
          className="flex-1 outline-none w-full h-full bg-transparent text-white placeholder-white"
          placeholder="Хайх..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button onClick={fetchWeather}>
          <i className="ri-search-line text-white text-2xl cursor-pointer"></i>
        </button>
      </div>

      
      <div className="flex flex-row mt-20">
        <div>
          <div className="w-[400px] h-[300px] bg-gray-400/60 rounded-3xl text-white p-4">
            {weather ? (
              <>
                <h2 className="text-xl font-bold text-center p-3 pb-7">{weather.name} хотын цаг агаар</h2>
                <div className="text-xl p-4">
                  <p className="pb-2">{weather.weather[0].description}</p>
                  <p className="pb-2">Температур: {weather.main.temp}°C</p>
                  <p className="pb-2">Салхи: {weather.wind.speed} м/с</p>
                  <p className="pb-2">Чийгшил: {weather.main.humidity}%</p>
                </div>
              </>
            ) : (
              <p>Уншиж байна...</p>
            )}
          </div>
          <div className="w-[250px]">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
        </div>
        <div className="w-[1200px] h-[600px] flex flex-wrap gap-4 bg-gray-400/60 rounded-3xl ml-10 p-10 text-white">
          {forecast.map((item, index) => (
            <div key={index} className="w-[200px] h-[300px] bg-white/60 rounded-xl p-5 text-black text-xl">
              <p className="font-semibold p-2">{item.dt_txt.split(" ")[0]}</p>
              <p className="pb-2">{item.weather[0].description}</p>
              <p>{item.main.temp}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
