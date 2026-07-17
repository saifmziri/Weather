import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { fetchWeather } from "./features/weathers/weatherApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faCloudShowersHeavy } from "@fortawesome/free-solid-svg-icons";

const CITIES = [
  { nameAr: "موسكو", nameEn: "Moscow", lat: 55.7558, lon: 37.6173 },
  { nameAr: "الرياض", nameEn: "Riyadh", lat: 24.7136, lon: 46.6753 },
  { nameAr: "دهوك", nameEn: "Duhok", lat: 36.8683, lon: 42.9888 },
  { nameAr: "بغداد", nameEn: "Baghdad", lat: 33.3152, lon: 44.3661 },
  { nameAr: "دبي", nameEn: "Dubai", lat: 25.2048, lon: 55.2708 },
  { nameAr: "لندن", nameEn: "London", lat: 51.5074, lon: -0.1278 },
  { nameAr: "نيويورك", nameEn: "New York", lat: 40.7128, lon: -74.006 },

  // Arab cities
  { nameAr: "جدة", nameEn: "Jeddah", lat: 21.5433, lon: 39.1728 },
  { nameAr: "مكة", nameEn: "Mecca", lat: 21.3891, lon: 39.8579 },
  { nameAr: "المدينة المنورة", nameEn: "Medina", lat: 24.5247, lon: 39.5692 },
  { nameAr: "الدوحة", nameEn: "Doha", lat: 25.2854, lon: 51.531 },
  { nameAr: "أبو ظبي", nameEn: "Abu Dhabi", lat: 24.4539, lon: 54.3773 },
  { nameAr: "الشارقة", nameEn: "Sharjah", lat: 25.3463, lon: 55.4209 },
  { nameAr: "الكويت", nameEn: "Kuwait City", lat: 29.3759, lon: 47.9774 },
  { nameAr: "مسقط", nameEn: "Muscat", lat: 23.588, lon: 58.3829 },
  { nameAr: "المنامة", nameEn: "Manama", lat: 26.2235, lon: 50.5876 },
  { nameAr: "صنعاء", nameEn: "Sana'a", lat: 15.3694, lon: 44.191 },
  { nameAr: "عدن", nameEn: "Aden", lat: 12.7855, lon: 45.0187 },
  { nameAr: "القاهرة", nameEn: "Cairo", lat: 30.0444, lon: 31.2357 },
  { nameAr: "الإسكندرية", nameEn: "Alexandria", lat: 31.2001, lon: 29.9187 },
  { nameAr: "عمّان", nameEn: "Amman", lat: 31.9454, lon: 35.9284 },
  { nameAr: "بيروت", nameEn: "Beirut", lat: 33.8938, lon: 35.5018 },
  { nameAr: "دمشق", nameEn: "Damascus", lat: 33.5138, lon: 36.2765 },
  { nameAr: "القدس", nameEn: "Jerusalem", lat: 31.7683, lon: 35.2137 },
  { nameAr: "غزة", nameEn: "Gaza", lat: 31.5017, lon: 34.4668 },
  { nameAr: "الجزائر", nameEn: "Algiers", lat: 36.7538, lon: 3.0588 },
  { nameAr: "تونس", nameEn: "Tunis", lat: 36.8065, lon: 10.1815 },
  { nameAr: "طرابلس", nameEn: "Tripoli", lat: 32.8872, lon: 13.1913 },
  { nameAr: "الرباط", nameEn: "Rabat", lat: 34.0209, lon: -6.8416 },
  { nameAr: "الدار البيضاء", nameEn: "Casablanca", lat: 33.5731, lon: -7.5898 },
  { nameAr: "نواكشوط", nameEn: "Nouakchott", lat: 18.0735, lon: -15.9582 },
  { nameAr: "الخرطوم", nameEn: "Khartoum", lat: 15.5007, lon: 32.5599 },
];

function App() {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather.weather);
  const loading = useSelector((state) => state.weather.isLoading);

  const { t, i18n } = useTranslation("weather");
  const isArabic = i18n.language === "ar";

  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const currentCity = CITIES[selectedCityIndex];

  useEffect(() => {
    const langParam = isArabic ? "ar" : "en";
    const action = dispatch(
      fetchWeather({ city: currentCity, lang: langParam }),
    );

    return () => {
      action.abort();
    };
  }, [isArabic, currentCity, dispatch]);

  const isHot = weather && weather.temp !== null && weather.temp > 25;

  const bgClass = isHot
    ? "bg-linear-to-br from-yellow-400 via-amber-500 to-amber-700"
    : "bg-linear-to-br from-sky-400 via-blue-600 to-slate-800";

  // كلاس التوهج البلوري الخلفي للأيقونة
  const glowClass = isHot
    ? "from-yellow-300 to-yellow-500"
    : "from-blue-300 to-sky-500";

  const handleCityChange = (e) => {
    setSelectedCityIndex(Number(e.target.value));
  };

  const handleLanguageToggle = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  const formattedDate = new Intl.DateTimeFormat(isArabic ? "ar" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-center items-center ${bgClass} antialiased p-4 transition-colors duration-500 relative overflow-hidden ${
        isArabic ? "font-ar" : "font-en"
      }`}
    >
      {/* 🌧️ تأثير المطر المتحرك: تم استبدال الكلاسات المخصصة بالكلاسات القياسية لتفادي التحذيرات */}
      {!isHot && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
          <div
            className="absolute w-0.5 h-5 bg-white top-0 left-[10%] animate-rain"
            style={{ animationDuration: "0.8s" }}
          ></div>
          <div
            className="absolute w-0.5 h-6 bg-white top-0 left-[25%] animate-rain"
            style={{ animationDuration: "1.2s", animationDelay: "0.2s" }}
          ></div>
          <div
            className="absolute w-px h-4.5 bg-white top-0 left-[40%] animate-rain"
            style={{ animationDuration: "0.9s", animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute w-0.5 h-5.5 bg-white top-0 left-[55%] animate-rain"
            style={{ animationDuration: "1.1s", animationDelay: "0.1s" }}
          ></div>
          <div
            className="absolute w-px h-5 bg-white top-0 left-[70%] animate-rain"
            style={{ animationDuration: "0.7s", animationDelay: "0.4s" }}
          ></div>
          <div
            className="absolute w-0.5 h-6 bg-white top-0 left-[85%] animate-rain"
            style={{ animationDuration: "1.3s", animationDelay: "0.3s" }}
          ></div>
          <div
            className="absolute w-0.5 h-4.5 bg-white top-0 left-[95%] animate-rain"
            style={{ animationDuration: "1.0s", animationDelay: "0.6s" }}
          ></div>
        </div>
      )}

      {/* اختيار المدينة */}
      <div
        className="w-full max-w-md mb-4 relative z-10"
        dir={isArabic ? "rtl" : "ltr"}
      >
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
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10 relative z-10">
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
                  {weather?.city || t("loading")}
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
                  <div
                    className={`absolute -inset-1 bg-linear-to-r ${glowClass} rounded-full blur-md opacity-25 group-hover:opacity-50 transition duration-1000`}
                  ></div>

                  <div className="relative w-28 h-28 flex justify-center items-center">
                    {isHot ? (
                      <FontAwesomeIcon
                        icon={faSun}
                        className="text-6xl text-amber-200 animate-spin"
                        style={{ animationDuration: "15s" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCloudShowersHeavy}
                        className="text-6xl text-blue-200 animate-bounce"
                        style={{ animationDuration: "2.5s" }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`${isArabic ? "text-right" : "text-left"} flex flex-col justify-center`}
              >
                <div className="flex items-start">
                  <span className="text-white text-6xl font-extrabold tracking-tighter drop-shadow-md">
                    {weather?.temp !== null && weather?.temp !== undefined
                      ? Math.round(weather.temp)
                      : "--"}
                  </span>
                  <span className="text-blue-300 text-2xl font-light mt-1 mx-1">
                    °C
                  </span>
                </div>
                <p className="text-blue-100 text-sm font-semibold tracking-wider uppercase mt-1">
                  {weather?.desc || "--"}
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
                  {weather?.min !== null && weather?.min !== undefined
                    ? `${Math.round(weather.min)}°`
                    : "--"}
                </span>
              </div>

              <div className="flex flex-col items-center border-x border-white/10">
                <span className="text-xs text-blue-200/70 font-medium">
                  {t("humidity")}
                </span>
                <span className="text-white text-lg font-bold mt-1">
                  {weather?.humidity !== null && weather?.humidity !== undefined
                    ? `${weather.humidity}%`
                    : "--"}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-blue-200/70 font-medium">
                  {t("max")}
                </span>
                <span className="text-white text-lg font-bold mt-1">
                  {weather?.max !== null && weather?.max !== undefined
                    ? `${Math.round(weather.max)}°`
                    : "--"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Language Toggle */}
      <button
        onClick={handleLanguageToggle}
        className="mt-6 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm cursor-pointer relative z-10"
      >
        {isArabic ? "English" : "عربي"}
      </button>
    </div>
  );
}

export default App;
