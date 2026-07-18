# 🌤️ Weather App

A simple and responsive weather application built with **React**, **Redux Toolkit**, and **Tailwind CSS**, using the **OpenWeatherMap API** to fetch real-time weather data.

## 🚀 Features

- 🔍 Search weather by city name
- 🌡️ Displays temperature, humidity, wind speed, and weather conditions
- 🎨 Clean and responsive UI styled with Tailwind CSS
- ⚡ Fast state management with Redux Toolkit (RTK Query)
- 🌍 Multi-language support (i18n)

## 🛠️ Tech Stack

- **React** – UI library
- **Vite** – Build tool & dev server
- **Redux Toolkit / RTK Query** – State management & API data fetching
- **Tailwind CSS** – Utility-first CSS framework
- **OpenWeatherMap API** – Weather data source

## 📂 Project Structure

```
weather/
├── src/
│   ├── app/
│   │   └── store.js          # Redux store configuration
│   ├── features/
│   │   └── weathers/
│   │       └── weatherApiSlice.js  # RTK Query API slice for weather data
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── i18n.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/saifmziri/Weather.git
cd weather
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your OpenWeatherMap API key:

```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

> Get a free API key at [openweathermap.org/api](https://openweathermap.org/api)

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
```

## 🔑 API Usage

This project uses the [OpenWeatherMap Current Weather Data API](https://openweathermap.org/current) to fetch weather information. The API calls are managed through **RTK Query** in `weatherApiSlice.js`.

Example endpoint:

```
https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
```

## 📸 Preview

_(Add a screenshot of your app here)_

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙌 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for the weather API
- [Vite](https://vitejs.dev/) for the build tooling
- [Tailwind CSS](https://tailwindcss.com/) for styling
