import { startVisualization } from './visualization.js';
import { startTemperatureVisualization } from './visualization.js';
import { startWork1Visualization } from './visualization.js';
import { startTempAnomalyVisualization } from './visualization.js';
import { startWBGTVisualization } from './visualization.js';
import { drawSeoulMaps } from './visualization.js';
import { drawSeaLevelRiseChart } from './visualization.js';
import { startRainfallVisualization } from './visualization.js';
import { drawScenarioComparison } from './visualization.js';


// general_one
const observerOne = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {startVisualization();  // 첫 번째 시각화 호출
            observer.unobserve(entry.target)
            }, 1000);
        }
    });
}, { threshold: 0.8 });
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
}, { threshold: 1.0 });
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
}, { threshold: 1.0 });
observerWork1.observe(document.querySelector('#heatstroke_one'));

// 열사병 2: 열스트레스 그래프
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startWBGTVisualization();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5});
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
}, { threshold: 1.0 });
observerRainfall.observe(document.querySelector('#rainfall_one'));


// 침수 3: 태린 그래프
document.addEventListener('DOMContentLoaded', function() {
    const observerRainfall = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    drawSeaLevelRiseChart();  // 그래프 그리기 함수 호출
                    observer.unobserve(entry.target);  // 한 번 실행 후 관찰 중지
                }, 1500);  // 2초(2000ms) 지연 후 실행
            }
        });
    }, { threshold: 0.9 });  // 80% 이상 보일 때 트리거

    observerRainfall.observe(document.querySelector('#rainfall_two'));
});

// 침수 4: 태린 그래프 
// index.js
document.addEventListener('DOMContentLoaded', function() {
    let selectedScenario = 'Rcp4.5';
    let selectedRegion = '한국';

    document.getElementById('scenario-4.5-2050').addEventListener('click', () => {
        selectedScenario = 'Rcp4.5';
        drawScenarioComparison(selectedScenario, selectedRegion);
    });

    document.getElementById('scenario-8.5-2050').addEventListener('click', () => {
        selectedScenario = 'Rcp8.5';
        drawScenarioComparison(selectedScenario, selectedRegion);
    });

    document.getElementById('region').addEventListener('change', (event) => {
        selectedRegion = event.target.value;
        drawScenarioComparison(selectedScenario, selectedRegion);
    });

    // 초기 상태 업데이트
    drawScenarioComparison(selectedScenario, selectedRegion);
});