import { getLatestData } from "./api.js";

let map;

window.onload = () => {

  map = L.map('map').setView([18.5204, 73.8567], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  L.marker([18.5204, 73.8567])
    .addTo(map)
    .bindPopup("🌱 Farm Location")
    .openPopup();

  loadField(); // run after map loads
};

/* ---------- DATA ---------- */

async function loadField(){
  try{
    const data = await getLatestData();

    document.getElementById("soil").innerText = data.soil + "%";
    document.getElementById("temp").innerText = data.temperature + "°C";
    document.getElementById("humidity").innerText = data.humidity + "%";
    document.getElementById("tank").innerText = data.tank + "%";

  }catch{
    console.log("Field data error");
  }
}

setInterval(loadField,5000);