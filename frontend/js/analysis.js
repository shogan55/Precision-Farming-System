import { getLatestData } from "./api.js";

const soilCtx = document.getElementById("soilChart");
const tempCtx = document.getElementById("tempChart");

let soilData = [];
let tempData = [];
let labels = [];

const soilChart = new Chart(soilCtx, {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Soil Moisture",
      data: soilData
    }]
  }
});

const tempChart = new Chart(tempCtx, {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Temperature",
      data: tempData
    }]
  }
});

async function updateCharts(){
  const data = await getLatestData();

  const time = new Date().toLocaleTimeString();

  labels.push(time);
  soilData.push(data.soil);
  tempData.push(data.temperature);

  if(labels.length > 10){
    labels.shift();
    soilData.shift();
    tempData.shift();
  }

  soilChart.update();
  tempChart.update();
}

setInterval(updateCharts,5000);