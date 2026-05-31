import { getLatestData, getWeather } from "./api.js";

/* ─── DECISION ENGINE ────────────────────────────────
   Uses the exact same keys Arduino sends via api.js   */
function decisionEngine(data, weather) {
  if (data.rain)                        return ['DO NOT WATER', 'Rain detected — irrigation paused automatically.', 'warn'];
  if (weather && weather.rainSoon)      return ['WAIT',         'Rain expected soon — hold irrigation.', 'warn'];
  if ((data.tank ?? 100) < 20)         return ['STOP',         'Tank critically low — refill before next cycle.', 'warn'];
  if ((data.soil ?? 100) < 35)         return ['IRRIGATE NOW', 'Soil moisture below 35% — immediate irrigation recommended.', 'green'];
  return ['NO IRRIGATION', 'All conditions stable — no action needed.', 'green'];
}

/* ─── WEATHER ────────────────────────────────────── */
async function getWeatherData() {
  try {
    const forecast = await getWeather();
    return {
      rainSoon: forecast.some(f => f.rain > 60),
      temp:     forecast[0].temp,
      rain:     forecast[0].rain
    };
  } catch {
    return null;
  }
}

/* ─── MAIN UI UPDATE ─────────────────────────────── */
async function updateUI(data) {

  /* ── Tank fill bar ───────────────────────────────── */
  const tank = data.tank ?? 0;
  const tankFill = document.getElementById('tankFill');
  const tankPct  = document.getElementById('tankPct');
  if (tankFill) tankFill.style.height = tank + '%';
  if (tankPct)  tankPct.textContent   = tank + '%';

  /* ── Gauges ─────────────────────────────────────── */
  setGauge('soilGauge',     data.soil,        40, 85);
  setGauge('tempGauge',     data.temperature, 10, 35);   // temperature — unchanged as requested
  setGauge('humidityGauge', data.humidity,    30, 80);
  setGauge('lightGauge',    data.light,       0,  100);

  document.getElementById('soilStatus').textContent =
    data.soil < 40 ? 'Below threshold' : data.soil > 85 ? 'Oversaturated' : 'Good range';
  document.getElementById('tempStatus').textContent =
    data.temperature > 35 ? 'High' : data.temperature < 10 ? 'Low' : 'Normal';
  document.getElementById('humidityStatus').textContent =
    data.humidity > 80 ? 'High' : data.humidity < 30 ? 'Dry' : 'Optimal';

  /* ── Rain & Pump ─────────────────────────────────── */
  document.getElementById('rain').textContent =
    data.rain ? 'Rain detected' : 'No rain detected';

  const pumpOn = data.pump === 'ON';
  document.getElementById('pump').textContent    = pumpOn ? 'Active' : 'Off';
  document.getElementById('pumpSub').textContent = pumpOn ? 'Auto-irrigation running' : 'Standby mode';
  const dot = document.getElementById('pumpDot');
  if (dot) dot.className = 'pump-dot ' + (pumpOn ? 'pump-on' : 'pump-off');

  /* ── Weather ─────────────────────────────────────── */
  const weather = await getWeatherData();
  if (weather) {
    document.getElementById('weatherTemp').textContent   = weather.temp + '°C';
    document.getElementById('weatherRain').textContent   = weather.rain + '% chance';
    document.getElementById('weatherAdvice').textContent = weather.rainSoon ? 'Delay irrigation' : 'Safe to irrigate';
  }

  /* ── Decision ────────────────────────────────────── */
  const [decision, reason, badgeClass] = decisionEngine(data, weather);
  document.getElementById('decision').textContent = decision;
  document.getElementById('reason').textContent   = reason;

  const badge = document.getElementById('decisionBadge');
  if (badge) {
    badge.textContent = badgeClass === 'warn' ? 'Attention' : 'All good';
    badge.className   = 'badge ' + badgeClass;
  }

  document.getElementById('updated').textContent =
    'Updated ' + new Date(data.createdAt).toLocaleTimeString('en-GB');
}

/* ─── GAUGE HELPER ───────────────────────────────────
   Conic gradient arc + dark inner ring so text is
   always readable regardless of arc color            */
function setGauge(id, value, low, high) {
  const el = document.getElementById(id);
  if (!el) return;

  const numVal = parseFloat(value) || 0;
  const pct    = Math.min(Math.max(numVal, 0), 100);
  const deg    = (pct / 100) * 360;

  let color = '#22c55e';               // good  — green
  if (numVal < low)  color = '#f59e0b'; // warn  — amber
  if (numVal > high) color = '#ef4444'; // bad   — red

  /* Conic arc + dark donut hole so the number is always visible */
  el.style.background = `
    radial-gradient(circle, #0d1a12 55%, transparent 56%),
    conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.06) ${deg}deg)
  `;

  /* Class drives text color + glow */
  el.className = 'gauge ' + (numVal < low ? 'warn' : numVal > high ? 'bad' : 'good');

  /* Value label */
  el.textContent = id === 'tempGauge'
    ? numVal.toFixed(1) + '°C'
    : Math.round(numVal) + '%';
}

/* ─── LOOP ───────────────────────────────────────── */
async function load() {
  try {
    document.getElementById('status').textContent = 'Live';
    const data = await getLatestData();
    await updateUI(data);
  } catch (e) {
    console.error('Dashboard load error:', e);
    document.getElementById('status').textContent = 'Server Offline';
  }
}

load();
setInterval(load, 4000);