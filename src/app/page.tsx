"use client";
import { useEffect, useState } from "react";
import { getWeatherByCity, getForecastByCity } from "./api/weather";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Home({className,}:React.HTMLAttributes<HTMLDivElement>) {
  const [city, setCity] = useState("Улаанбаатар");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 1),
    to: addDays(new Date(2025, 5, 1), 0)});

  const fetchWeather = async () => {
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);

      const forecastData = await getForecastByCity(city);
      console.log(forecastData)

      const filteredForecast = forecastData.list.filter((item: any) => {
        if(!date?.from || !date?.to) return false;
        const itemDate = new Date(item.dt_txt);
        
        const fromDate = new Date(date.from);
        const toDate = new Date(date.to);
        
        const isInRange =
          itemDate >= new Date(fromDate.setHours(0, 0, 0, 0)) &&
          itemDate <= new Date(toDate.setHours(23, 59, 59, 999));

        const isNoon = itemDate.getHours() === 12;
        return isInRange && isNoon;
      });
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
  }, [date]);

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
        </div>
        <div className="w-[1200px] h-[600px] bg-gray-400/60 rounded-3xl ml-10 p-10 space-y-5">
          <div className={cn("grid gap-2", className)}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-wrap gap-4">
            {forecast.length > 0 ? (
              forecast.map((item, index) => {
                const date = new Date(item.dt_txt);
                const day = format(date, "MMM dd");
                const time = format(date, "HH:mm");

                return (
                  <div
                    key={index}
                    className="w-[200px] h-[300px] bg-white/60 rounded-xl p-5 text-black text-xl"
                  >
                    <p className="font-semibold p-2">{day}</p>
                    <p className="text-sm text-gray-700">{time}</p>
                    <p className="pb-2">{item.weather[0].description}</p>
                    <p>{item.main.temp}°C</p>
                  </div>
                );
              })
            ) : (
              <p className="text-white text-xl">Сонгосон өдөрт таарах мэдээлэл алга байна.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
