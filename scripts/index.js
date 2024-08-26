import { startVisualization } from './visualization.js';
import { startTemperatureVisualization } from './visualization.js';
import { startWork1Visualization } from './visualization.js';
import { startTempAnomalyVisualization } from './visualization.js';
import { startWBGTVisualization } from './visualization.js';
import { drawSeoulMaps } from './visualization.js';
import { drawSeaLevelRiseChart } from './visualization.js';
import { startRainfallVisualization } from './visualization.js';
import { drawStaticRainfallVisualization } from './visualization.js';

// general_one
const observerOne = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startVisualization();  // 첫 번째 시각화 호출
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observerOne.observe(document.querySelector('#general_one'));

// general_two
const observerTwo = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log("Starting temperature visualization"); // 관찰자 로그
            startTemperatureVisualization();  // 두 번째 시각화 호출
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observerTwo.observe(document.querySelector('#general_two'));

// general_three
document.addEventListener('DOMContentLoaded', () => {
    startTempAnomalyVisualization();
});

// -----------------------------------------------------

// 열사병 1: 호우 태풍 폭염 그래프
const observerWork1 = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startWork1Visualization();  // 시각화 함수 호출
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observerWork1.observe(document.querySelector('#heatstroke_one'));

// 열사병 2: 열스트레스 그래프
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startWBGTVisualization();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observer.observe(document.querySelector('#heatstroke_two'));

// -----------------------------------------------------

// 이상기후: 서울 러브버그 시각화
document.addEventListener('DOMContentLoaded', function() {
    drawSeoulMaps();
});

// -----------------------------------------------------

// 침수 1: Rainfall network visualization observer
const observerRainfall = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startRainfallVisualization();  // Start rainfall animation
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observerRainfall.observe(document.querySelector('#rainfall_one'));

// Initialize static visualizations once the corresponding section comes into view
const observerStaticRainfall = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            drawStaticRainfallVisualization("#visualization-spring-1997-2007", "data/rainfall_network_seasonal_1997-2007.json", "Spring");
            drawStaticRainfallVisualization("#visualization-summer-1997-2007", "data/rainfall_network_seasonal_1997-2007.json", "Summer");
            drawStaticRainfallVisualization("#visualization-autumn-1997-2007", "data/rainfall_network_seasonal_1997-2007.json", "Autumn");
            drawStaticRainfallVisualization("#visualization-winter-1997-2007", "data/rainfall_network_seasonal_1997-2007.json", "Winter");

            drawStaticRainfallVisualization("#visualization-spring-2018-2023", "data/rainfall_network_seasonal_2018-2023.json", "Spring");
            drawStaticRainfallVisualization("#visualization-summer-2018-2023", "data/rainfall_network_seasonal_2018-2023.json", "Summer");
            drawStaticRainfallVisualization("#visualization-autumn-2018-2023", "data/rainfall_network_seasonal_2018-2023.json", "Autumn");
            drawStaticRainfallVisualization("#visualization-winter-2018-2023", "data/rainfall_network_seasonal_2018-2023.json", "Winter");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observerStaticRainfall.observe(document.querySelector('#static-plots'));

// 침수 2: 태린 그래프
document.addEventListener('DOMContentLoaded', function() {
    drawSeaLevelRiseChart();
});
observerRainfall.observe(document.querySelector('#rainfall_two'));
