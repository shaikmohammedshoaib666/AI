import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudFog, 
  CloudLightning, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  ThermometerSun,
  ShieldAlert
} from 'lucide-react';

const iconMap = {
  Sun: Sun,
  SunDim: Sun,
  CloudSun: CloudSun,
  Cloud: Cloud,
  CloudFog: CloudFog,
  CloudDrizzle: CloudRain,
  CloudRain: CloudRain,
  CloudLightning: CloudLightning,
};

export default function WeatherWidget({ weatherData, language }) {
  if (!weatherData || !weatherData.current) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm animate-pulse flex items-center justify-center h-48">
        <p className="text-stone-400 text-sm">
          {language === 'te' ? 'వాతావరణ సమాచారం లోడ్ అవుతోంది...' : 'Loading local meteorological data...'}
        </p>
      </div>
    );
  }

  const { current, agricultural_alerts = [], forecast = [] } = weatherData;
  const WeatherIcon = iconMap[current.icon] || CloudSun;

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-agri-900 to-stone-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
      {/* Decorative background sun rays / glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300">
            {language === 'te' ? 'ప్రత్యక్ష వ్యవసాయ వాతావరణం' : 'Live Agro-Meteorology'}
          </span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{current.condition}</span>
          </h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black tracking-tight text-white flex items-baseline justify-end gap-1">
            <span>{Math.round(current.temperature)}°C</span>
            <span className="text-xs font-normal text-emerald-200">
              ({language === 'te' ? 'అనిపిస్తుంది' : 'Feels like'} {Math.round(current.apparent_temperature)}°C)
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-emerald-100/70 font-medium">{language === 'te' ? 'గాలిలో తేమ' : 'Humidity'}</p>
            <p className="text-base font-bold text-white">{current.humidity}%</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-blue-100/70 font-medium">{language === 'te' ? 'వర్షపాతం' : 'Precipitation'}</p>
            <p className="text-base font-bold text-white">{current.precipitation} mm</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-amber-100/70 font-medium">{language === 'te' ? 'గాలి వేగం' : 'Wind Speed'}</p>
            <p className="text-base font-bold text-white">{current.wind_speed} km/h</p>
          </div>
        </div>
      </div>

      {/* Agricultural Alerts (Spraying safety, rain warnings) */}
      {agricultural_alerts.length > 0 && (
        <div className="mb-5 space-y-2">
          {agricultural_alerts.map((alert, idx) => {
            const isSuccess = alert.level === 'success';
            const isWarning = alert.level === 'warning';
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                  isSuccess
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-100'
                    : isWarning
                    ? 'bg-rose-950/70 border-rose-500/50 text-rose-100'
                    : 'bg-amber-950/70 border-amber-500/40 text-amber-100'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-semibold mb-0.5">{alert.title}</strong>
                  <span>{alert.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7-Day Forecast */}
      {forecast.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-2.5">
            {language === 'te' ? 'వచ్చే 7 రోజుల వాతావరణ అంచనా' : '7-Day Agronomic Forecast'}
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {forecast.map((day, idx) => {
              const DayIcon = iconMap[day.icon] || Sun;
              const dateStr = day.date ? new Date(day.date).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', { weekday: 'short' }) : `Day ${idx + 1}`;
              return (
                <div
                  key={idx}
                  className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-xl border border-white/10 text-center flex flex-col items-center justify-between"
                >
                  <span className="text-[11px] font-medium text-emerald-200">{dateStr}</span>
                  <DayIcon className="w-5 h-5 my-1.5 text-emerald-300" />
                  <div className="text-[11px] font-semibold text-white">
                    {Math.round(day.temp_max)}° / <span className="text-white/60 font-normal">{Math.round(day.temp_min)}°</span>
                  </div>
                  {day.rain_probability > 0 && (
                    <span className="text-[9px] font-medium text-blue-300 mt-1 flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" /> {day.rain_probability}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
