import { startVisualization } from './visualization.js';
import { startTemperatureVisualization } from './visualization.js';
import { startRainfallVisualization } from './visualization.js';
import { startWork1Visualization } from './visualization.js';
import { startTempAnomalyVisualization } from './visualization.js';
import { startWBGTVisualization } from './visualization.js';
import { drawSeoulMaps } from './visualization.js';

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

// 서울 러브버그 시각화
// visualization.js에서 시각화 함수를 가져옵니다.
document.addEventListener('DOMContentLoaded', function() {
    drawSeoulMaps();
});

// -----------------------------------------------------

// Rainfall network visualization observer
const observerRainfall = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startRainfallVisualization();  // Start rainfall visualization
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observerRainfall.observe(document.querySelector('#three'));

