import { startVisualization } from './visualization.js';
import { startTemperatureVisualization } from './visualization.js';
import { startRainfallVisualization } from './visualization.js';
import { startWork1Visualization } from './visualization.js';


// 첫 번째 섹션에 대한 관찰자 설정
const observerOne = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startVisualization();  // 첫 번째 시각화 호출
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observerOne.observe(document.querySelector('#general_one'));

// 두번째 섹션에 대한 관찰자 설정
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


// 가희 그래프
const observerWork1 = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startWork1Visualization();  // 시각화 함수 호출
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
observerWork1.observe(document.querySelector('#work1'));

