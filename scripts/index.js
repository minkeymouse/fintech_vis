import { startVisualization } from './visualization.js';
import { startTemperatureVisualization } from './visualization.js';

// 첫 번째 섹션에 대한 관찰자 설정
const observerOne = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startVisualization();  // 첫 번째 시각화 호출
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observerOne.observe(document.querySelector('#one'));

const observerTwo = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log("Starting temperature visualization"); // 관찰자 로그
            startTemperatureVisualization();  // 두 번째 시각화 호출
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observerTwo.observe(document.querySelector('#two')); 