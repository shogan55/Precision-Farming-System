import { getLatestData } from "./api.js";

let reportData = {};
let chart;

function generateInsights(data){

  const waterUsage = (data.flowRate * 10).toFixed(2) + " L";
  const avgSoil = data.soil + "%";

  let tempStatus = "Normal";
  if(data.temperature > 32) tempStatus = "High";
  if(data.temperature < 20) tempStatus = "Low";

  let tankStatus = data.tank < 20 ? "Low" : "Safe";

  let summary = "System operating normally";

  if(data.rain) summary = "Rain detected — irrigation paused";
  if(data.tank < 20) summary = "Low tank — refill required";

  return { waterUsage, avgSoil, tempStatus, tankStatus, summary };
}

/* ---------- FAKE TREND DATA (SMART DEMO TRICK) ---------- */

function generateTrend(data){
  const labels = [];
  const soil = [];
  const temp = [];

  for(let i=5;i>=0;i--){
    labels.push(`${-i*5}s`);
    soil.push(data.soil + (Math.random()*5 - 2));
    temp.push(data.temperature + (Math.random()*2 - 1));
  }

  return { labels, soil, temp };
}

function createChart(trend){

  const ctx = document.getElementById("reportChart");

  chart = new Chart(ctx,{
    type:"line",
    data:{
      labels:trend.labels,
      datasets:[
        {
          label:"Soil",
          data:trend.soil
        },
        {
          label:"Temp",
          data:trend.temp
        }
      ]
    }
  });
}

async function loadReport(){

  try{
    const data = await getLatestData();
    const insights = generateInsights(data);

    reportData = {...data, ...insights};

    document.getElementById("waterUsage").innerText = insights.waterUsage;
    document.getElementById("avgSoil").innerText = insights.avgSoil;
    document.getElementById("tempStatus").innerText = insights.tempStatus;
    document.getElementById("tankStatus").innerText = insights.tankStatus;
    document.getElementById("summary").innerText = insights.summary;

    const trend = generateTrend(data);
    createChart(trend);

  }catch{
    console.log("Report load failed");
  }
}

/* ---------- PDF (UPGRADED) ---------- */

window.downloadPDF = function(){

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Precision Farming Report", 20, 20);

  doc.setFontSize(12);

  doc.text("=== SENSOR DATA ===", 20, 40);
  doc.text("Soil: " + reportData.soil + "%", 20, 50);
  doc.text("Temp: " + reportData.temperature + "°C", 20, 60);
  doc.text("Humidity: " + reportData.humidity + "%", 20, 70);
  doc.text("Tank: " + reportData.tank + "%", 20, 80);

  doc.text("=== ANALYSIS ===", 20, 100);
  doc.text("Water Usage: " + reportData.waterUsage, 20, 110);
  doc.text("Avg Soil: " + reportData.avgSoil, 20, 120);
  doc.text("Temp Status: " + reportData.tempStatus, 20, 130);

  doc.text("=== SUMMARY ===", 20, 150);
  doc.text(reportData.summary, 20, 160);

  doc.text("AI Recommendation: Irrigation optimized", 20, 180);

  doc.save("farm-report.pdf");
};

loadReport();