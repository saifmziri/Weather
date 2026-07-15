import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

// مصفوفة الدول والمدن مع إحداثياتها الدقيقة
const CITIES = [
  { nameAr: "موسكو", nameEn: "Moscow", lat: 55.7558, lon: 37.6173 },
  { nameAr: "الرياض", nameEn: "Riyadh", lat: 24.7136, lon: 46.6753 },
  { nameAr: "دهوك", nameEn: "Duhok", lat: 36.8683, lon: 42.9888 },
  { nameAr: "بغداد", nameEn: "Baghdad", lat: 33.3152, lon: 44.3661 },
  { nameAr: "دبي", nameEn: "Dubai", lat: 25.2048, lon: 55.2708 },
  { nameAr: "لندن", nameEn: "London", lat: 51.5074, lon: -0.1278 },
  { nameAr: "نيويورك", nameEn: "New York", lat: 40.7128, lon: -74.006 },
];

function App() {
  const { t, i18n } = useTranslation("weather");
  const isArabic = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [weather, setWeather] = useState({
    city: "",
    temp: null,
    desc: "",
    min: null,
    max: null,
    humidity: null,
  });

  const apiKey = "2dee2f1b3f3da94aef27fd53e421c98d";
  const currentCity = CITIES[selectedCityIndex];

  // دالة جلب البيانات مع استقبال الإحداثيات ديناميكياً لمنع الـ Linter Error
  const fetchWeather = useCallback(
    (city, langParam, signal) => {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&lang=${langParam}`,
          { signal },
        )
        .then((response) => {
          const data = response.data;
          setWeather({
            city: langParam === "ar" ? city.nameAr : city.nameEn, // الاسم من المصفوفة، مو من الـ API
            temp: data.main.temp - 273.15,
            desc: data.weather[0].description,
            min: data.main.temp_min - 273.15,
            max: data.main.temp_max - 273.15,
            humidity: data.main.humidity,
          });
          setLoading(false);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("Request canceled successfully");
          } else {
            console.error("Error fetching weather data:", error);
            setLoading(false);
          }
        });
    },
    [apiKey],
  );
  // استدعاء الـ API عند تغيير اللغة أو تغيير المدينة المختارة
  useEffect(() => {
    const controller = new AbortController();
    const langParam = isArabic ? "ar" : "en";

    fetchWeather(currentCity, langParam, controller.signal);

    return () => {
      controller.abort();
    };
  }, [isArabic, currentCity, fetchWeather]);

  const handleCityChange = (e) => {
    setLoading(true);
    setSelectedCityIndex(Number(e.target.value));
  };

  // تبديل اللغة عبر i18next مباشرة بدل حالة محلية مكررة
  const handleLanguageToggle = () => {
    setLoading(true);
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  const formattedDate = new Intl.DateTimeFormat(isArabic ? "ar" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-center items-center bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 antialiased p-4 ${
        isArabic ? "font-ar" : "font-en"
      }`}
    >
      {/* اختيار المدينة */}
      <div className="w-full max-w-md mb-4" dir={isArabic ? "rtl" : "ltr"}>
        <label className="block text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
          {t("chooseCity")}
        </label>
        <select
          value={selectedCityIndex}
          onChange={handleCityChange}
          className="w-full bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-medium py-3 px-4 rounded-2xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-white/30 backdrop-blur-md cursor-pointer transition-all duration-200"
        >
          {CITIES.map((city, index) => (
            <option
              key={index}
              value={index}
              className="bg-slate-800 text-white"
            >
              {isArabic ? city.nameAr : city.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10">
        {loading ? (
          <div className="animate-pulse space-y-6 py-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div className="h-8 bg-white/20 rounded-md w-1/3"></div>
              <div className="h-4 bg-white/20 rounded-md w-1/4"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="h-24 bg-white/20 rounded-full w-24 mx-auto"></div>
              <div className="space-y-3">
                <div className="h-12 bg-white/20 rounded-md w-3/4"></div>
                <div className="h-4 bg-white/20 rounded-md w-1/2"></div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-2">
              <div className="h-10 bg-white/20 rounded-md"></div>
              <div className="h-10 bg-white/20 rounded-md"></div>
              <div className="h-10 bg-white/20 rounded-md"></div>
            </div>
          </div>
        ) : (
          <div dir={isArabic ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-6">
              <div>
                <h1 className="text-white text-3xl font-black tracking-wide drop-shadow-sm">
                  {weather.city || t("loading")}
                </h1>
                <p className="text-blue-200 text-sm font-medium mt-1">
                  {formattedDate}
                </p>
              </div>

              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-2 gap-4 items-center py-4">
              <div className="flex justify-center items-center">
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                  <svg
                    className="relative w-28 h-28 drop-shadow-lg text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1.5m0 15V21m-9-9h1.5m16.5 0H21m-1.5-6h-1.5M4.5 6H6m13.5 12h-1.5m-12 0H6"
                      className="animate-spin opacity-80 [animation-duration:15s]"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`${isArabic ? "text-right" : "text-left"} flex flex-col justify-center`}
              >
                <div className="flex items-start">
                  <span className="text-white text-6xl font-extrabold tracking-tighter drop-shadow-md">
                    {weather.temp !== null ? Math.round(weather.temp) : "--"}
                  </span>
                  <span className="text-blue-300 text-2xl font-light mt-1 mx-1">
                    °C
                  </span>
                </div>
                <p className="text-blue-100 text-sm font-semibold tracking-wider uppercase mt-1">
                  {weather.desc}
                </p>
              </div>
            </div>

            {/* Footer Metrics */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="text-xs text-blue-200/70 font-medium">
                  {t("min")}
                </span>
                <span className="text-white text-lg font-bold mt-1">
                  {weather.min !== null ? `${Math.round(weather.min)}°` : "--"}
                </span>
              </div>

              <div className="flex flex-col items-center border-x border-white/10">
                <span className="text-xs text-blue-200/70 font-medium">
                  {t("humidity")}
                </span>
                <span className="text-white text-lg font-bold mt-1">
                  {weather.humidity !== null ? `${weather.humidity}%` : "--"}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-blue-200/70 font-medium">
                  {t("max")}
                </span>
                <span className="text-white text-lg font-bold mt-1">
                  {weather.max !== null ? `${Math.round(weather.max)}°` : "--"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Language Toggle */}
      <button
        onClick={handleLanguageToggle}
        className="mt-6 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm cursor-pointer"
      >
        {isArabic ? "English" : "عربي"}
      </button>
    </div>
  );
}

export default App;
