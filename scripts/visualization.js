// scripts/visualization.js

// genenral one: 해수면 + 지상 온도 상승 그래프
export function startVisualization() {
    d3.json("data/temp_anomaly.json").then(function(data) {
        var svgWidth = 1000, svgHeight = 500, margin = {top: 20, right: 20, bottom: 30, left: 50};
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;

        var svg = d3.select("#visualization-one")
                    .append("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var x = d3.scalePoint().domain(months).range([0, width]);
        var y = d3.scaleLinear().domain([-5, 4]).range([height, 0]);

        var line = d3.line()
            .x(function(d) { return x(months[d.Month - 1]); })
            .y(function(d) { return y(d.temp_anomaly); });

        var years = Array.from(new Set(data.map(d => d.Year))).sort();
        var color = d3.scaleSequential(d3.interpolateYlOrRd)
                      .domain(d3.extent(years));  // 연도에 따라 색상이 점점 빨간색으로 변함

        var yearIndex = 0;

        function drawNextYear() {
            if (yearIndex >= years.length) return;

            var year = years[yearIndex];
            var yearData = data.filter(d => d.Year === year);

            svg.append("path")
            .datum(yearData)
            .attr("class", "line")  // 클래스 추가
            .attr("data-year", year)  // 연도 데이터 속성 추가
            .attr("fill", "none")
            .attr("stroke", color(year))
            .attr("stroke-width", 1.5)
            .attr("d", line)
            .attr("stroke-dasharray", function() {
                    var totalLength = this.getTotalLength();
                    return totalLength + " " + totalLength;
            })
            .attr("stroke-dashoffset", function() {
                    return this.getTotalLength();
            })
            .transition()
            .duration(300)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

            yearIndex++;
            setTimeout(drawNextYear, 150);
        }

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        svg.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

        // 범례 추가: 색상 그라디언트로 표현
        var gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "legendGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

        gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color(years[0])); // 시작 연도 색상

        gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color(2023)); // 2023년 색상

        // 범례 바 그리기
        svg.append("rect")
        .attr("x", width / 2 - 100)
        .attr("y", -margin.top + 10)
        .attr("width", 200)
        .attr("height", 10)
        .style("fill", "url(#legendGradient)");

        // 범례 텍스트 추가
        svg.append("text")
        .attr("x", width / 2 - 110)
        .attr("y", -margin.top + 25)
        .style("font-size", "18px")
        .style("text-anchor", "end")
        .text(years[0]); // 시작 연도

        svg.append("text")
        .attr("x", width / 2 + 110)
        .attr("y", -margin.top + 25)
        .style("font-size", "18px")
        .style("text-anchor", "start")
        .text(2023); // 2023년

        drawNextYear();

        // 마우스 이벤트 추가 (애니메이션 적용)
        svg.on("mouseover", function() {
            svg.selectAll(".line")
                .transition()
                .duration(500) // 자연스러운 색상 전환을 위한 애니메이션
                .attr("stroke", function(d) {
                    return d[0].Year === 2023 ? color(2023) : "#d3d3d3"; // 2023년은 색상 유지, 나머지는 회색
                })
                .attr("stroke-width", function(d) {
                    return d[0].Year === 2023 ? 3 : 1.5; // 2023년은 굵어짐
                });

            // 2023년도 라는 텍스트 추가
            svg.append("text")
                .attr("class", "year-label")
                .attr("x", width - 50)
                .attr("y", y(data.filter(d => d.Year === 2023).slice(-1)[0].temp_anomaly)) // 2023년의 마지막 값 위치에 텍스트 추가
                .attr("dy", "-0.5em")
                .attr("text-anchor", "end")
                .style("font-size", "18px")
                .style("fill", color(2023))
                .style("font-weight", "bold")  // 텍스트 볼드체 적용
                .text("2023");
        });

        svg.on("mouseout", function() {
            svg.selectAll(".line")
                .transition()
                .duration(300) // 자연스러운 색상 전환을 위한 애니메이션
                .attr("stroke", function(d) {
                    return color(d[0].Year); // 원래 색상 복원
                })
                .attr("stroke-width", 1.5); // 원래 두께로 복원

            // 2023년도 라벨 제거
            svg.selectAll(".year-label").remove();
        });
    });
}

// general two: 평균 기온 상승 그래프 (윤서)
export function startTemperatureVisualization() {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#visualization-two")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const periodLabel = svg.append("text")
        .attr("class", "period-label")
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("font-size", "30px")
        .attr("fill", "black")
        .attr("text-anchor", "middle");

    function smoothData(data, windowSize = 3) {
        return data.map((d, i, arr) => {
            const start = Math.max(0, i - Math.floor(windowSize / 2));
            const end = Math.min(arr.length, i + Math.ceil(windowSize / 2));
            const windowData = arr.slice(start, end);
            const smoothedFreq = d3.mean(windowData, d => d.frequency);
            return { ...d, frequency: smoothedFreq };
        });
    }

    d3.json("data/data_for_choi.json").then(data => {
        data.forEach(periodData => {
            periodData.data = smoothData(periodData.data);
        });

        const x = d3.scaleLinear()
            .domain([15, 40])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, 0.015])
            .range([height, 0]);

        // x축의 눈금 제거
        const xAxis = d3.axisBottom(x)
            .tickValues([]); // 기본 눈금과 라벨 제거

        // x축을 먼저 그리고 텍스트를 수동으로 추가
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        // 카테고리 경계값에 따른 세로선 추가
        const boundaries = [20, 27, 29.5, 35]; // 카테고리 간 경계값들
        boundaries.forEach(pos => {
            svg.append("line")
                .attr("x1", x(pos))
                .attr("y1", 0)
                .attr("x2", x(pos))
                .attr("y2", height)
                .attr("stroke", "#ccc")  // 선의 색상
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "4 4");  // 점선으로 만듦
        });
        periodLabel.raise();

        // 커스텀 텍스트 라벨 추가
        const categories = ["Extremely cold", "Cold", "Normal", "Hot", "Extremely hot"];
        const colors = ["#000080", "#4682b4", "#bbbbbb", "#e65c00", "#b32400"];
        const tickPositions = [17.5, 23.5, 28.25, 32, 37.5];

        categories.forEach((category, i) => {
            svg.append("text")
                .attr("x", x(tickPositions[i]))
                .attr("y", height + margin.bottom - 20)
                .attr("fill", colors[i])
                .attr("font-weight", "bold")
                .attr("font-size", "14px")
                .attr("text-anchor", "middle")
                .text(category);
        });
        
        const area = d3.area()
            .x(d => x(d.temperature))
            .y0(height)
            .y1(d => y(d.frequency))
            .curve(d3.curveBasis);

        // colors와 반복문을 사용하여 colorSections 생성
        const ranges = [[15, 20], [20, 27], [27, 29.5], [29.5, 35], [35, 40]];
        const colorSections = colors.map((color, i) => ({ color: color, range: ranges[i] }));
        
        // 초기 회색 영역 (기본 기간)
        const initialPeriodData = data[0];
        svg.append("path")
            .datum(initialPeriodData.data)
            .attr("class", "base-area")
            .attr("fill", "url(#darkHatched)")  // 빗금친 패턴 사용
            .attr("d", area)
            .attr("opacity", 0.3);  // 가시성을 위한 불투명도 조정

        let currentPeriod = 0;

        function animatePeriodChange(label, startPeriod, endPeriod, duration) {
            // 기간이 존재하지 않을 경우 초기화
            if (!startPeriod || !endPeriod || !startPeriod.includes('-') || !endPeriod.includes('-')) {
                label.text(endPeriod); // 그냥 새로운 기간을 설정
                return;
            }
        
            const startYear = parseInt(startPeriod.split('-')[0], 10);
            const endYear = parseInt(endPeriod.split('-')[0], 10);
        
            if (isNaN(startYear) || isNaN(endYear)) {
                label.text(endPeriod); // 잘못된 값이 있을 경우 새로운 기간을 바로 설정
                return;
            }
        
            const stepTime = Math.abs(Math.floor(duration / (endYear - startYear)));
            const startTime = new Date().getTime();
            const endTime = startTime + duration;
        
            function updatePeriod() {
                const now = new Date().getTime();
                const remainingTime = Math.max((endTime - now) / duration, 0);
                const currentYear = Math.round(endYear - (remainingTime * (endYear - startYear)));
                label.text(`${currentYear}-${currentYear + (parseInt(endPeriod.split('-')[1], 10) - parseInt(endPeriod.split('-')[0], 10))}`);
        
                if (currentYear === endYear) {
                    clearInterval(timer);
                }
            }
        
            const timer = setInterval(updatePeriod, stepTime);
        }

        function updatePeriod() {
            const periodData = data[currentPeriod];

            // Update or create paths for each section
            const paths = svg.selectAll(".area")
                .data(colorSections, d => d.color);

            // Enter new paths
            paths.enter().append("path")
                .attr("class", "area")
                .attr("fill", d => d.color)
                .attr("d", d => area(periodData.data.filter(p => p.temperature >= d.range[0] && p.temperature <= d.range[1])))
                .attr("opacity", 0)
                .transition()
                .duration(500)
                .attr("opacity", 0.7);

            // Update existing paths
            paths.transition()
                .duration(500)
                .attr("d", d => area(periodData.data.filter(p => p.temperature >= d.range[0] && p.temperature <= d.range[1])))
                .attr("opacity", 0.7);

            // 숫자 애니메이션 시작
            const currentPeriodValue = periodLabel.text();  // 현재 라벨의 기간 값을 가져옴
            const newPeriodValue = periodData.period;  // 새로 업데이트될 기간

            animatePeriodChange(periodLabel, currentPeriodValue, newPeriodValue, 300);  // 0.3초 동안 애니메이션 실행

            currentPeriod = (currentPeriod + 1) % data.length;
        }

        updatePeriod();
        setInterval(updatePeriod, 2000); // 1.5초마다 업데이트
    }).catch(error => {
        console.error("Error loading JSON data:", error);
    });
        // 기본 영역을 위한 빗금 패턴 추가
        svg.append("defs")
        .append("pattern")
        .attr("id", "darkHatched")
        .attr("width", 4)
        .attr("height", 4)
        .attr("patternUnits", "userSpaceOnUse")
        .append("path")
        .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
        .attr("stroke", "#555")
        .attr("stroke-width", 1.2);
}

// general three
export function startTempAnomalyVisualization() {
    d3.json('./data/temp_month.json').then(function(data) {
        console.log('데이터 로드 성공:', data);  // 데이터가 제대로 로드되었는지 확인

        const margin = { top: 30, right: 30, bottom: 50, left: 70 },
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#temp-anomaly-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([1, 12])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([-5, 30])  // 섭씨 온도 범위로 설정
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(d.Month))
            .y(d => y(d.temp_avg));  // temp_avg_celsius 대신 temp_avg로 수정

        const allYears = Array.from(new Set(data.map(d => d.Year)));
        const pastYears = allYears.filter(year => year < 2023);
        const currentYear = 2024;
        const lastYear = 2023;

        // 회색으로 2023년 이전의 데이터 그리기
        pastYears.forEach(year => {
            const yearlyData = data.filter(d => d.Year === year);
            if (yearlyData.length > 0) {  // 데이터가 있을 경우에만 그리기
                console.log(`그리기: ${year}년 데이터`, yearlyData);
                svg.append("path")
                    .datum(yearlyData)
                    .attr("fill", "none")
                    .attr("stroke", "gray")
                    .attr("stroke-width", 1.5)
                    .attr("d", line)
                    .style("opacity", 0.2);
            }
        });

        // 2023년 데이터 그리기
        const lastYearData = data.filter(d => d.Year === lastYear);
        if (lastYearData.length > 0) {
            console.log(`그리기: 2023년 데이터`, lastYearData);
            svg.append("path")
                .datum(lastYearData)
                .attr("fill", "none")
                .attr("stroke", "orange")
                .attr("stroke-width", 2.5)
                .attr("d", line)
                .style("opacity", 0.7);
        }

        // 2024년 데이터 그리기
        const currentYearData = data.filter(d => d.Year === currentYear);
        if (currentYearData.length > 0) {
            console.log(`그리기: 2024년 데이터`, currentYearData);
            svg.append("path")
                .datum(currentYearData)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 2.5)
                .attr("d", line);
        }

        // 마지막 데이터 라벨 추가
        if (currentYearData.length > 0) {
            const lastDataPoint = currentYearData[currentYearData.length - 1];
            svg.append("text")
                .attr("x", x(lastDataPoint.Month))
                .attr("y", y(lastDataPoint.temp_avg) - 10)
                .attr("fill", "red")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text(`${lastDataPoint.Month}, 2024`);

            // 온도 라벨 추가
            // svg.append("text")
            //     .attr("x", x(lastDataPoint.Month))
            //     .attr("y", y(lastDataPoint.temp_avg) - 25)
            //     .attr("fill", "red")
            //     .style("font-size", "12px")
            //     .text(`${lastDataPoint.temp_avg}°C`);
        }

        // x축 생성 (월만 표시)
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(12).tickFormat(d => d3.timeFormat("%b")(new Date(0, d - 1))));

        // y축 생성 (섭씨 온도)
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d => `${d}°C`));

        // 제목 추가
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold");
    }).catch(function(error) {
        console.error('데이터 로드 실패:', error);
    });
}

// -----------------------------------------------------

// 열사병: 호우 태풍 폭염 그래프
export function startWork1Visualization() {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#heatstroke_one_graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = [
        { year: "2011", downpour: 77, typhoon: 1, heatwave: 29 },
        { year: "2012", downpour: 2, typhoon: 14, heatwave: 63 },
        { year: "2013", downpour: 4, typhoon: 0, heatwave: 51 },
        { year: "2014", downpour: 2, typhoon: 0, heatwave: 16 },
        { year: "2015", downpour: 0, typhoon: 0, heatwave: 42 },
        { year: "2016", downpour: 1, typhoon: 6, heatwave: 81 },
        { year: "2017", downpour: 7, typhoon: 0, heatwave: 44 },
        { year: "2018", downpour: 2, typhoon: 3, heatwave: 162 },
        { year: "2019", downpour: 0, typhoon: 18, heatwave: 30 }
    ];

    const x0 = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain(['downpour', 'typhoon', 'heatwave'])
        .range([0, x0.bandwidth()]);

    const y = d3.scaleLinear()
        .domain([0, 180])
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(['downpour', 'typhoon', 'heatwave'])
        .range(["#1679AB", "#03C988", "#FF6A38"]);

    // Bar chart animation
    const bars = svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", d => `translate(${x0(d.year)},0)`);

    bars.selectAll("rect")
        .data(d => ['downpour', 'typhoon', 'heatwave'].map(key => ({ key: key, value: d[key] })))
        .enter().append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", height)
        .attr("width", x1.bandwidth())
        .attr("fill", d => color(d.key))
        .transition()
        .duration(2500)
        .delay((d, i) => i * 200)  // 바가 순차적으로 애니메이션됨
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value));

    // 각 바 그래프 위에 y 값을 표시
    bars.selectAll("text")
        .data(d => ['downpour', 'typhoon', 'heatwave'].map(key => ({ key: key, value: d[key] })))
        .enter().append("text")
        .attr("x", d => x1(d.key) + x1.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5) // 바 그래프의 위에 위치하도록 y 값을 약간 위로 이동
        .attr("text-anchor", "middle")
        .style("font-size", "12px") // 폰트 크기 설정
        .style("fill", "black") // 텍스트 색상 설정
        .text(d => d.value)
        .attr("opacity", 0)
        .transition()
        .duration(2500)
        .delay((d, i) => i * 200)
        .attr("opacity", 1);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Line chart container but hidden initially
    const line = d3.line()
        .x(d => x0(d.year.toString()) + x0.bandwidth() / 2 + x0.bandwidth() * 0.3)
        .y(d => y(d.value));

    const linePath = svg.append("path")
        .datum(data.map(d => ({ year: d.year, value: d.heatwave })))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("opacity", 0);  // Initially hidden

    // Add a transparent rectangle to catch mouse events
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "transparent")
        .on("mouseover", function() {
            linePath.transition()
                .duration(500)
                .attr("opacity", 1);  // Show the line chart
        })
        .on("mouseout", function() {
            linePath.transition()
                .duration(500)
                .attr("opacity", 0);  // Hide the line chart
        });

    // 범례 추가 코드
    const labels = {
        "downpour": "폭우",
        "typhoon": "태풍",
        "heatwave": "폭염"
    };
    
    const legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);
    
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);
    
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("font-size", "14px")
        .style("text-anchor", "end")
        .text(d => labels[d]);
}

// 열사병: 열스트레스 그래프
export function startWBGTVisualization() {
    d3.json('data/wbgt_data_with_forecast.json').then(function(data) {
        console.log('데이터 로드 성공:', data);

        const margin = { top: 20, right: 100, bottom: 50, left: 70 },
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#heatstroke_two_graph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // 날짜 데이터를 파싱하여 Date 객체로 변환
        data.forEach(d => {
            d.date = d3.timeParse("%m-%d")(d.month_day); // 날짜만 파싱
            d.year = +d.year;
            d.WBGT = +d.WBGT; // WBGT 값을 숫자로 변환
        });

        // x축과 y축 범위 설정
        const x = d3.scaleTime()
            .domain([new Date(0, 5, 1), new Date(0, 7, 31)]) // 6월 1일 ~ 8월 31일의 범위로 설정
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([13, 35]) // WBGT 값 범위에 맞게 y축 설정
            .range([height, 0]);

        // WBGT 라인 설정
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.WBGT));

        // 모든 연도별 회색 그래프를 먼저 그립니다.
        const years = d3.groups(data, d => d.year);
        years.forEach(([year, values]) => {
            if (year !== 2024 && year !== 2050 && year !== 2023) {
                svg.append("path")
                    .datum(values)
                    .attr("fill", "none")
                    .attr("stroke", "#a9a9a9")
                    .attr("stroke-width", 1.5)
                    .attr("d", line)
                    .attr("opacity", 0)
                    .transition()
                    .duration(1000)
                    .attr("opacity", 1);
            }
        });

        // 검은색과 빨간색 선을 왼쪽에서 오른쪽으로 그리기
        setTimeout(() => {
            [2023, 2024].forEach(targetYear => {
                const yearData = years.find(([year, _]) => year === targetYear)[1];
                
                // 시간 순서대로 정렬 (필요한 경우)
                yearData.sort((a, b) => d3.ascending(a.date, b.date));
        
                const path = svg.append("path")
                    .datum(yearData)
                    .attr("fill", "none")
                    .attr("stroke", targetYear === 2024 ? "red" : "#333333")
                    .attr("stroke-width", 2.5)
                    .attr("d", line)
                    .attr("stroke-dasharray", function() {
                        return this.getTotalLength();
                    })
                    .attr("stroke-dashoffset", function() {
                        return this.getTotalLength();
                    });
        
                path.transition()
                    .duration(4000)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
            });
        }, 1000);

        // 검은색과 빨간색 그래프가 그려진 후에 온도별로 색칠된 부분이 나타납니다.
        setTimeout(() => {
            svg.append("rect")
                .attr("x", 0)
                .attr("y", y(35))
                .attr("width", width)
                .attr("height", y(32) - y(35))
                .attr("fill", "red")
                .style("opacity", 0)
                .transition()
                .duration(3000)
                .style("opacity", 0.3);

            svg.append("rect")
                .attr("x", 0)
                .attr("y", y(32))
                .attr("width", width)
                .attr("height", y(30) - y(32))
                .attr("fill", "orange")
                .style("opacity", 0)
                .transition()
                .duration(3000)
                .style("opacity", 0.3);

            svg.append("rect")
                .attr("x", 0)
                .attr("y", y(30))
                .attr("width", width)
                .attr("height", y(28) - y(30))
                .attr("fill", "yellow")
                .style("opacity", 0)
                .transition()
                .duration(3000)
                .style("opacity", 0.3);
        }, 5000); // 2초 대기 후 색칠된 부분 그리기 시작

        // 파란색 선은 마우스를 올리면 나타나도록 설정
        const yearData = years.find(([year, _]) => year === 2050)[1];
        const blueLine = svg.append("path")
            .datum(yearData)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2.5)
            .attr("stroke-dasharray", "5,5")
            .attr("d", line)
            .attr("opacity", 0); // 처음에는 보이지 않음

        svg.on("mouseover", function() {
            blueLine.transition()
                .duration(1000)
                .attr("opacity", 1); // 마우스를 올리면 나타남
        });

        svg.on("mouseout", function() {
            blueLine.transition()
                .duration(1000)
                .attr("opacity", 0); // 마우스를 치우면 다시 사라짐
        });

        // x축과 y축을 추가합니다.
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m-%d")));

        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d => `${d}°C`));

        // 그래프 제목을 추가합니다.
        // svg.append("text")
        //     .attr("x", width / 2)
        //     .attr("y", -10)
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "16px")
        //     .style("font-weight", "bold")
        //     .text("Summer Daily WBGT Trends (1974-2024)");

        // 범례 추가
        const legendData = [
            { name: '2023', color: '#333333', width: 1.5, dasharray: 'none' },
            { name: '2024', color: 'red', width: 2.5, dasharray: 'none' },
            { name: '2050', color: 'blue', width: 2.5, dasharray: '5,5' }
        ];

        const legend = svg.selectAll(".legend")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width - 100}, ${height - margin.bottom - (legendData.length - i) * 20})`);  // 오른쪽 하단으로 위치 조정
    

        legend.append("line")
            .attr("x1", 0)
            .attr("x2", 20)
            .attr("y1", 10)
            .attr("y2", 10)
            .attr("stroke", d => d.color)
            .attr("stroke-width", d => d.width)
            .attr("stroke-dasharray", d => d.dasharray);

        legend.append("text")
            .attr("x", 25)
            .attr("y", 10)
            .attr("dy", ".35em")
            .style("font-size", "18px")
            .style("text-anchor", "start")
            .text(d => d.name);
    }).catch(function(error) {
        console.error('데이터 로드 실패:', error);
    });
}

// -----------------------------------------------------

//이상기후: 러브버그 그래프
export function drawSeoulMaps() {
    const map2022Url = "./data/map_2022.geojson";
    const map2023Url = "./data/map_2023.geojson";
    const width = 450;
    const height = 600;

    // 툴팁을 위한 div 요소 생성
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid grey")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    Promise.all([
        d3.json(map2022Url),
        d3.json(map2023Url)
    ]).then(function([data2022, data2023]) {

        // 데이터에서 기온의 최소값과 최대값 동적으로 계산 (온도가 0이 아닌 값들만)
        const temps2022 = data2022.features.map(d => d.properties['평균기온(°C)']).filter(temp => temp !== 0);
        const temps2023 = data2023.features.map(d => d.properties['평균기온(°C)']).filter(temp => temp !== 0);
        const minTemp = Math.min(...temps2022.concat(temps2023));
        const maxTemp = Math.max(...temps2022.concat(temps2023));

        // Reds 색상 맵의 상위 65%만 사용
        const colorScale = d3.scaleSequential()
            .domain([minTemp, maxTemp])
            .interpolator(d3.interpolateRgb("#ffd1c8", "#d52600"))  // 빨강에서 파랑으로 보간
            .clamp(true);

        // 원 크기 스케일 조정
        const circleScale = d3.scaleSqrt()
            .domain([0, d3.max(data2022.features.concat(data2023.features), d => d.properties.Complaints)])
            .range([0, 55]);  // 원의 크기를 크게 조정

        function drawMap(svg, data, projection, path, year) {
            // 온도가 0인 지역 빗금 처리
            svg.selectAll("path.zero-temp")
                .data(data.features.filter(d => d.properties['평균기온(°C)'] === 0))
                .enter().append("path")
                .attr("class", "district zero-temp")
                .attr("d", path)
                .attr("fill", "lightgrey")
                .attr("stroke", "grey")
                .attr("stroke-width", 0.8)
                .attr("fill-pattern", "url(#diagonalHatch)");  // 빗금 스타일

            // 나머지 지역은 색상 맵 적용 및 마우스 오버 이벤트 추가
            svg.selectAll("path.district")
                .data(data.features.filter(d => d.properties['평균기온(°C)'] !== 0))
                .enter().append("path")
                .attr("class", "district")
                .attr("d", path)
                .attr("fill", function(d) {
                    const temp = d.properties['평균기온(°C)'];
                    return colorScale(temp);
                })
                .attr("stroke", "grey")
                .attr("stroke-width", 0.8)
                .on("mouseover", function(event, d) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`
                        <strong>${d.properties['SIGUNGU_NM']}</strong><br/>
                        온도: ${d.properties['평균기온(°C)']}°C<br/>
                        민원 수: ${d.properties.Complaints}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 5) + "px")
                           .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

            // 민원 데이터를 원으로 시각화
            svg.selectAll("circle")
                .data(data.features)
                .enter().append("circle")
                .attr("cx", function(d) { return path.centroid(d)[0]; })
                .attr("cy", function(d) { return path.centroid(d)[1]; })
                .attr("r", function(d) { return circleScale(d.properties.Complaints); })
                .attr("fill", "#1d4d9f")
                .attr("opacity", 0.5)
                .on("mouseover", function(event, d) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`
                        <strong>${d.properties['SIGUNGU_NM']}</strong><br/>
                        온도: ${d.properties['평균기온(°C)']}°C<br/>
                        민원 수: ${d.properties.Complaints}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 5) + "px")
                           .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

            // 지도 제목 추가
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .text(`${year}년`);
        }

        // 패턴 정의 (빗금)
        const svgDefs = d3.select("body").append("svg")
            .attr("width", 0)
            .attr("height", 0)
            .append("defs");

        svgDefs.append("pattern")
            .attr("id", "diagonalHatch")
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", 4)
            .attr("height", 4)
            .append("path")
            .attr("d", "M0,0 L4,4")
            .attr("stroke", "grey")
            .attr("stroke-width", 1);

        // 2022년 지도 그리기
        const svg2022 = d3.select("#map-2022").append("svg")
            .attr("width", width)
            .attr("height", height);

        const projection2022 = d3.geoMercator()
            .fitSize([width, height], data2022);

        const path2022 = d3.geoPath().projection(projection2022);

        drawMap(svg2022, data2022, projection2022, path2022, "2022");

        // 2023년 지도 그리기
        const svg2023 = d3.select("#map-2023").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("margin-left", "20px");  // 여기서 마진을 추가합니다.
            
        const projection2023 = d3.geoMercator()
            .fitSize([width, height], data2023);

        const path2023 = d3.geoPath().projection(projection2023);

        drawMap(svg2023, data2023, projection2023, path2023, "2023");

        // 특정 컨테이너에 SVG 범례 추가
        const svgLegend = d3.select("#legend-container").append("svg")
            .attr("width", 500)
            .attr("height", 50);

        const defs = svgLegend.append("defs");

        const linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        linearGradient.selectAll("stop")
            .data([
                {offset: "0%", color: colorScale(minTemp)},
                {offset: "100%", color: colorScale(maxTemp)}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

        svgLegend.append("rect")
            .attr("x", 100)
            .attr("y", 0)
            .attr("width", 300)
            .attr("height", 20)
            .style("fill", "url(#linear-gradient)");

        svgLegend.append("text")
            .attr("class", "legend")
            .attr("x", 100)
            .attr("y", 40)
            .style("font-size", "18px")
            .text(`${minTemp}°C`);

        svgLegend.append("text")
            .attr("class", "legend")
            .attr("x", 400)
            .attr("y", 40)
            .style("font-size", "18px")
            .attr("text-anchor", "end")
            .text(`${maxTemp}°C`);

        // svgLegend.append("text")
        //     .attr("class", "legend")
        //     .attr("x", 250)
        //     .attr("y", 40)
        //     .style("font-size", "18px")
        //     .attr("text-anchor", "middle")
        //     .text("Temperature (°C)");
    });
}
// -----------------------------------------------------
//강수량 네트워크: Seasonal Rainfall Network Visualization (민기)
export function startRainfallVisualization() {
    const width = 960, height = 600;

    const svg = d3.select("#rainfall_map").append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoMercator()
        .center([128, 36])  // Center coordinates of South Korea
        .scale(5000)        // Zoom level
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    d3.json("data/korea_geojson.json").then(geoData => {
        svg.append("g")
            .selectAll("path")
            .data(geoData.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "#cccccc")  // Map background color (light grey)
            .attr("stroke", "#333");

        d3.json("data/rainfall_network_seasonal.json").then(data => {
            let seasonIndex = 0;

            function update() {
                const currentSeasonData = data[seasonIndex];

                const nodes = currentSeasonData.nodes;
                const links = currentSeasonData.edges;

                const sizeScale = d3.scaleLinear()
                    .domain([0, d3.max(nodes, d => d.rainfall)])
                    .range([2, 10]);

                const colorScale = d3.scaleSequential(d3.interpolateBlues)
                    .domain([0, d3.max(nodes, d => d.rainfall)]);

                const edgeColor = "#007ACC";  // Blue color for the edges

                svg.selectAll(".node").remove();
                svg.selectAll(".link").remove();
                svg.selectAll(".season-label").remove();

                svg.append("g")
                    .selectAll(".link")
                    .data(links)
                    .enter().append("line")
                    .attr("class", "link")
                    .attr("x1", d => {
                        const sourceNode = nodes.find(node => node.id === d.source);
                        return projection([sourceNode.longitude, sourceNode.latitude])[0];
                    })
                    .attr("y1", d => {
                        const sourceNode = nodes.find(node => node.id === d.source);
                        return projection([sourceNode.longitude, sourceNode.latitude])[1];
                    })
                    .attr("x2", d => {
                        const targetNode = nodes.find(node => node.id === d.target);
                        return projection([targetNode.longitude, targetNode.latitude])[0];
                    })
                    .attr("y2", d => {
                        const targetNode = nodes.find(node => node.id === d.target);
                        return projection([targetNode.longitude, targetNode.latitude])[1];
                    })
                    .style("stroke-width", d => Math.sqrt(d.weight) * 0.75)
                    .style("stroke", edgeColor)
                    .style("stroke-opacity", 0.9);

                svg.append("g")
                    .selectAll(".node")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", d => sizeScale(d.rainfall))
                    .attr("cx", d => projection([d.longitude, d.latitude])[0])
                    .attr("cy", d => projection([d.longitude, d.latitude])[1])
                    .style("fill", d => d.rainfall >= 0.1 ? colorScale(d.rainfall) : "#FFD700");

                svg.append("text")
                    .attr("class", "season-label")
                    .attr("x", 600)
                    .attr("y", 500)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "18px")
                    .attr("font-weight", "bold")
                    .attr("fill", "#333")
                    .text(`Season: ${currentSeasonData.season}`);
            }

            function animate() {
                update();
                seasonIndex = (seasonIndex + 1) % data.length;
            }

            function startAnimation() {
                animate();
                setTimeout(startAnimation, 1000);
            }

            startAnimation();  // Start the animation
        });
    });
}


//침수3: 그래프 (태린)
export function drawSeaLevelRiseChart() {
    const jsonFilePath = 'data/sea_level_yearly.json';

    d3.json(jsonFilePath).then(data => {
        // 상단 마진을 더 크게 설정
        const margin = { top: 40, right: 50, bottom: 30, left: 50 },  // 기존 20에서 40으로 증가
            width = 1000 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        const svg = d3.select("#sea_level_chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([d3.min(data, d => d.연도), d3.max(data, d => d.연도)]) 
            .range([0, width]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        // Y축 최대값에 여유를 더 줌
        const minY = d3.min(data, d => d['국내 평균 해수면 높이']);
        const maxY = d3.max(data, d => d['국내 평균 해수면 높이']) * 1.1;  // 기존 값에 10% 여유를 줌

        const y = d3.scaleLinear()
            .domain([minY, maxY])  // Y축 도메인을 여유 있게 설정
            .range([height, 0]);

        const yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        const gridLines = svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat("")
            )
            .selectAll("line")
            .style("stroke", "lightgrey")
            .style("stroke-dasharray", "3,3");

        const line = d3.line()
            .x(d => x(d.연도))
            .y(d => y(d['국내 평균 해수면 높이']))
            .curve(d3.curveMonotoneX);

        const path = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        const area = d3.area()
            .x(d => x(d.연도))
            .y0(y(minY)) 
            .y1(d => y(d['국내 평균 해수면 높이'])) 
            .curve(d3.curveMonotoneX);

        function updateChart(i) {
            const newX = d3.scaleLinear()
                .domain([d3.min(data, d => d.연도), d3.max(data.slice(0, i + 1), d => d.연도)])
                .range([0, width]);

            const newY = d3.scaleLinear()
                .domain([minY, maxY])  // Y축 도메인을 여유 있게 설정
                .range([height, 0]);

            xAxis.transition()
                .duration(500)
                .call(d3.axisBottom(newX).tickFormat(d3.format("d")));

            yAxis.transition()
                .duration(500)
                .call(d3.axisLeft(newY));

            gridLines.transition()
                .duration(500)
                .call(d3.axisLeft(newY)
                    .tickSize(-width)
                    .tickFormat("")
                )
                .selectAll("line")
                .style("stroke", "lightgrey")
                .style("stroke-dasharray", "3,3");

            path.datum(data.slice(0, i + 1))
                .attr("d", d3.line()
                    .x(d => newX(d.연도))
                    .y(d => newY(d['국내 평균 해수면 높이']))
                    .curve(d3.curveMonotoneX)
                )
                .transition()
                .duration(300)
                .ease(d3.easeLinear);

            if (i === data.length - 1) {
                setTimeout(() => {
                    const startHeight = height;
                    const targetHeight = y(minY);

                    const timer = d3.timer(function(elapsed) {
                        const t = Math.min(1, elapsed / 5000); 
                        const currentHeight = startHeight - t * (startHeight - targetHeight);

                        svg.selectAll("path.area")
                            .data([data])
                            .join("path")
                            .attr("class", "area")
                            .attr("fill", "steelblue")
                            .attr("opacity", 0.5)
                            .attr("d", d3.area()
                                .x(d => x(d.연도))
                                .y0(currentHeight)
                                .y1(d => y(d['국내 평균 해수면 높이']))
                                .curve(d3.curveMonotoneX));

                        if (t === 1) timer.stop();
                    });

                    const focus = svg.append("g")
                        .attr("class", "focus")
                        .style("display", "none");

                    focus.append("circle")
                        .attr("r", 5)
                        .attr("fill", "steelblue");

                    focus.append("rect")
                        .attr("class", "tooltip")
                        .attr("width", 120)
                        .attr("height", 50)
                        .attr("x", 10)
                        .attr("y", -22)
                        .attr("rx", 4)
                        .attr("ry", 4)
                        .style("fill", "lightsteelblue");

                    focus.append("text")
                        .attr("class", "tooltip-year")
                        .attr("x", 18)
                        .attr("y", -2)
                        .style("fill", "black")
                        .style("font-size", "16px");  

                    focus.append("text")
                        .attr("class", "tooltip-sea-level")
                        .attr("x", 18)
                        .attr("y", 18)
                        .style("fill", "black")
                        .style("font-size", "16px");  

                    svg.append("rect")
                        .attr("class", "overlay")
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("pointer-events", "all")
                        .on("mouseover", () => focus.style("display", null))
                        .on("mouseout", () => focus.style("display", "none"))
                        .on("mousemove", mousemove);

                        function mousemove(event) {
                            const bisect = d3.bisector(d => d.연도).left;
                            const x0 = x.invert(d3.pointer(event)[0]);
                            const i = bisect(data, x0, 1);
                            const d0 = data[i - 1];
                            const d1 = data[i];
                            const d = x0 - d0.연도 > d1.연도 - x0 ? d1 : d0;
                        
                            // 툴팁 위치를 조정하여 화면 밖으로 나가지 않도록 함
                            const tooltipX = x(d.연도);
                            const tooltipY = y(d['국내 평균 해수면 높이']);
                            const tooltipWidth = 120;
                            const tooltipHeight = 50;
                        
                            const offsetX = (tooltipX + tooltipWidth > width) ? -tooltipWidth - 20 : 10;
                            const offsetY = (tooltipY - tooltipHeight < 0) ? tooltipHeight + 10 : -22;
                        
                            focus.attr("transform", `translate(${tooltipX},${tooltipY})`);
                            focus.select(".tooltip")
                                .attr("x", offsetX)
                                .attr("y", offsetY);
                        
                            focus.select(".tooltip-year")
                                .attr("x", offsetX + 8)
                                .attr("y", offsetY + 20)
                                .text(`${d.연도}년`);
                        
                            focus.select(".tooltip-sea-level")
                                .attr("x", offsetX + 8)
                                .attr("y", offsetY + 40)
                                .text(`해수면: ${d['국내 평균 해수면 높이']} cm`);
                        }
                }, 1000);
            }
        }

        for (let i = 0; i < data.length; i++) {
            setTimeout(() => {
                updateChart(i);
            }, i * 300);
        }

    }).catch(error => {
        console.error('Error loading or parsing data:', error);
    });
}

//친수4: 고구마 (태린)
export function drawCube(svg, x, y, size, color) {
    const group = svg.append("g")
        .attr("transform", `translate(${x}, ${y - size * 0.5})`);  // Y 좌표를 위쪽으로 이동

    // 상단면
    group.append("polygon")
        .attr("points", `
            0,0
            ${size},${-size * 0.5}
            ${size * 2},0
            ${size},${size * 0.5}
        `)
        .attr("fill", d3.color(color).brighter(1.5));

    // 좌측면
    group.append("polygon")
        .attr("points", `
            0,0
            0,${size}
            ${size},${size * 1.5}
            ${size},${size * 0.5}
        `)
        .attr("fill", d3.color(color).darker(1));

    // 정면
    group.append("polygon")
        .attr("points", `
            ${size},${size * 0.5}
            ${size * 2},0
            ${size * 2},${size}
            ${size},${size * 1.5}
        `)
        .attr("fill", color);
}
export function drawScenarioComparison(scenario, selectedRegion) {
    const data = {
        "Rcp4.5": {
            "여의도": 1,
            "2050년": {
                "한국": 83.75,
                "전라도": 53.55,
                "충청도": 30.75,
                "경상도": 44.12
            },
            "2100년": {
                "한국": 119.36,
                "전라도": 81.58,
                "충청도": 51.48,
                "경상도": 66.48
            }
        },
        "Rcp8.5": {
            "여의도": 1,
            "2050년": {
                "한국": 88.55,
                "전라도": 58.14,
                "충청도": 35.14,
                "경상도": 49.32
            },
            "2100년": {
                "한국": 172.94,
                "전라도": 123.38,
                "충청도": 75.21,
                "경상도": 92.74
            }
        }
    };

    const svg = d3.select("#treemap");
    svg.selectAll("*").remove();  // 기존 시각화 제거

    const svgWidth = parseInt(svg.attr("width"));
    const svgHeight = parseInt(svg.attr("height"));
    const cubeSize = Math.min(svgWidth, svgHeight) / 32;  // 여의도 크기 조절 (SVG 크기에 비례)

    const yeouidoSize = cubeSize * Math.sqrt(data[scenario]["여의도"]);
    const size2050 = cubeSize * Math.sqrt(data[scenario]["2050년"][selectedRegion]);
    const size2100 = cubeSize * Math.sqrt(data[scenario]["2100년"][selectedRegion]);

    // 2100년 큐브를 먼저 그리기
    drawCube(svg, svgWidth * 0.45, svgHeight * 0.45, size2100, "#0b3467");
    svg.append("text")
        .attr("x", svgWidth * 0.45 + size2100)
        .attr("y", svgHeight * 0.45 + size2100 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("2100년: 여의도의 " + Math.round(data[scenario]["2100년"][selectedRegion]) + "배");

    // 2050년 큐브 그리기
    drawCube(svg, svgWidth * 0.25, svgHeight * 0.6, size2050, "#69b3a2");
    svg.append("text")
        .attr("x", svgWidth * 0.25 + size2050)
        .attr("y", svgHeight * 0.6 + size2050 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("2050년: 여의도의 " + Math.round(data[scenario]["2050년"][selectedRegion]) + "배");

    // 여의도 큐브 그리기
    drawCube(svg, svgWidth * 0.22, svgHeight * 0.75, yeouidoSize, "#ffcc00");
    svg.append("text")
        .attr("x", svgWidth * 0.22 + yeouidoSize)
        .attr("y", svgHeight * 0.75 + yeouidoSize + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("여의도" );
}
