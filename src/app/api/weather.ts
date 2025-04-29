const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export async function getWeatherByCity(city: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=mn&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Хотоо шалгана уу");
  return res.json();
}

export async function getForecastByCity(city: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=mn&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("5 өдрийн мэдээллийг авахад алдаа гарлаа");
  return res.json();
}
