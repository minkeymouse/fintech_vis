// scripts/visualization.js

// 해수면 + 지상 온도 상승 그래프
export function startVisualization() {
    d3.json("data/temp_anomaly.json").then(function(data) {
        var svgWidth = 600, svgHeight = 400, margin = {top: 20, right: 20, bottom: 30, left: 50};
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;

        var svg = d3.select("#visualization-one")
                    .append("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear().domain([1, 12]).range([0, width]);
        var y = d3.scaleLinear().domain([-5, 7]).range([height, 0]);

        var line = d3.line()
            .x(function(d) { return x(d.Month); })
            .y(function(d) { return y(d.temp_anomaly); });

        var years = Array.from(new Set(data.map(d => d.Year))).sort();
        var color = d3.scaleSequential(d3.interpolateYlOrRd)
                      .domain(d3.extent(years));

        var yearIndex = 0;

        function drawNextYear() {
            if (yearIndex >= years.length) return;

            var year = years[yearIndex];
            var yearData = data.filter(d => d.Year === year);

            svg.append("path")
            .datum(yearData)
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
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        svg.append("g")
        .call(d3.axisLeft(y));

        drawNextYear();
    });
}

// 평균 기온 상승 그래프 (윤서)
export function startTemperatureVisualization() {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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

    d3.json("data/data_for_choi.json").then(data => {
        const x = d3.scaleLinear()
            .domain([15, 40])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, 0.015])
            .range([height, 0]);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", margin.bottom - 10)
            .style("text-anchor", "middle")
            .text("Temperature Category");

        svg.append("g")
            .call(yAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 10)
            .style("text-anchor", "middle")
            .text("Frequency");

        const area = d3.area()
            .x(d => x(d.temperature))
            .y0(height)
            .y1(d => y(d.frequency))
            .curve(d3.curveBasis);

        const colorSections = [
            { color: "#0033cc", range: [15, 23] },
            { color: "#0099cc", range: [23, 28] },
            { color: "#cccccc", range: [28, 30] },
            { color: "#ff9966", range: [30, 34] },
            { color: "#cc3300", range: [34, 40] },
        ];

        function drawInitialPeriod() {
            const initialPeriodData = data[0];

            function drawSection(section, delay) {
                const sectionData = initialPeriodData.data.filter(d => d.temperature >= section.range[0] && d.temperature <= section.range[1]);
                svg.append("path")
                    .datum(sectionData)
                    .attr("class", "initial-area")
                    .attr("fill", section.color)
                    .attr("d", area)
                    .attr("opacity", 0)
                    .transition()
                    .duration(1000)
                    .delay(delay)
                    .ease(d3.easeCubic)
                    .attr("opacity", 1)
                    .on("end", function() {
                        if (section === colorSections[colorSections.length - 1]) {
                            d3.selectAll(".initial-area")
                                .transition()
                                .duration(1000)
                                .attr("fill", "#000000")
                                .attr("opacity", 0.3);
                        }
                    });
            }

            colorSections.forEach((section, i) => {
                drawSection(section, i * 100); // 각 구간이 200ms 간격으로 시작
            });
        }

        let currentPeriod = 1;

        function drawNextPeriod() {
            if (currentPeriod >= data.length) {
                svg.selectAll(".area").remove();
                currentPeriod = 0;
                drawInitialPeriod();
                setTimeout(drawNextPeriod, 1000);
                return;
            }

            const periodData = data[currentPeriod];

            svg.selectAll(".area")
                .transition()
                .duration(1000)
                .attr("opacity", 0)
                .remove();

            colorSections.forEach((section, i) => {
                const sectionData = periodData.data.filter(d => d.temperature >= section.range[0] && d.temperature <= section.range[1]);
                svg.append("path")
                    .datum(sectionData)
                    .attr("class", "area")
                    .attr("fill", section.color)
                    .attr("d", area)
                    .attr("opacity", 0)
                    .transition()
                    .duration(1000)
                    .delay(i * 200)
                    .ease(d3.easeCubic)
                    .attr("opacity", 0.8);
            });

            periodLabel.text(periodData.period);
            currentPeriod++;
            setTimeout(drawNextPeriod, 3000); // 전체 기간 후 2초 대기
        }

        drawInitialPeriod();
        setTimeout(drawNextPeriod, 3000); // 첫 번째 기간 후 3초 후에 다음 기간 시작
    }).catch(error => {
        console.error("Error loading JSON data:", error);
    });
}

// Rainfall Network Visualization
export function startRainfallVisualization() {
    const width = 960, height = 600;

    const svg = d3.select("#visualization-three").append("svg")
        .attr("width", width)
        .attr("height", height);

    // 지도 투영 설정 (Mercator projection 사용)
    const projection = d3.geoMercator()
        .center([128, 36])  // 대한민국 중심 좌표
        .scale(5000)        // 확대 비율
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // 대한민국 GeoJSON 파일 로드
    d3.json("data/korea_geojson.json").then(geoData => {
        // 대한민국 지도 그리기
        svg.append("g")
            .selectAll("path")
            .data(geoData.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "#cccccc")  // Map background color (light grey)
            .attr("stroke", "#333");

        // 강수량 데이터 로드 및 처리
        d3.json("data/rainfall_network_monthly.json").then(data => {
            console.log("JSON data loaded:", data);
            let monthIndex = 0;

            function update() {
                const currentMonthData = data[monthIndex];
                
                const nodes = currentMonthData.nodes;
                const links = currentMonthData.edges;

                const sizeScale = d3.scaleLinear()
                    .domain([0, d3.max(nodes, d => d.rainfall)])
                    .range([2, 10]);  // Reduced the size range for smaller nodes

                const colorScale = d3.scaleSequential(d3.interpolateBlues)
                    .domain([0, d3.max(nodes, d => d.rainfall)]);

                const edgeColor = "#007ACC";  // More visible blue color for the edges

                // 이전 요소 제거
                svg.selectAll(".node").remove();
                svg.selectAll(".link").remove();
                svg.selectAll(".month-label").remove();  // Remove previous text labels

                // 연결선 그리기
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
                    .style("stroke-width", d => Math.sqrt(d.weight) * 0.75)  // Adjusted to make edges more visible
                    .style("stroke", edgeColor)  // Use the more visible blue color
                    .style("stroke-opacity", 0.9);  // Increased opacity for better visibility

                // 노드 그리기
                svg.append("g")
                    .selectAll(".node")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", d => sizeScale(d.rainfall))
                    .attr("cx", d => projection([d.longitude, d.latitude])[0])
                    .attr("cy", d => projection([d.longitude, d.latitude])[1])
                    .style("fill", d => d.rainfall >= 0.1 ? colorScale(d.rainfall) : "#FFD700"); // Yellow for low rainfall

                // 월 표시 (이전 텍스트 제거 후 다시 추가)
                svg.append("text")
                    .attr("class", "month-label")
                    .attr("x", width / 2)
                    .attr("y", 30)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "24px")
                    .attr("font-weight", "bold")  // Make the text bold
                    .attr("fill", "#333")
                    .text(`Month: ${currentMonthData.month}`);
            }

            function animate() {
                update();
                monthIndex = (monthIndex + 1) % data.length;
            }

            let intervalSpeed = 1000;  // 기본 속도
            function adjustSpeed() {
                const year = parseInt(data[monthIndex].month.split('-')[0]);
                if (year >= 2015) {
                    intervalSpeed = 1000;  // 2019년 이후 속도 느림
                } else {
                    intervalSpeed = 50;  // 2010년 이전 속도 빠름
                }
            }

            function startAnimation() {
                adjustSpeed();
                animate();
                setTimeout(startAnimation, intervalSpeed);
            }

            startAnimation();  // 애니메이션 시작
        });
    });
}

// 열사병: 호우 태풍 폭염 그래프
export function startWork1Visualization() {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
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

    // 수정된 lineData, 기존 데이터 값에 비례하도록 조정된 값
    const lineData = [
        { year: "2011", value: 29 }, // 원래 값은 1
        { year: "2012", value: 63 }, // 원래 값은 14
        { year: "2013", value: 51 }, // 원래 값은 14
        { year: "2014", value: 16 }, // 원래 값은 1
        { year: "2015", value: 42 }, // 원래 값은 8
        { year: "2016", value: 81 }, // 원래 값은 21
        { year: "2017", value: 44 }, // 원래 값은 7
        { year: "2018", value: 162 }, // 원래 값은 30
        { year: "2019", value: 30 }  // 원래 값은 9
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
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", d => `translate(${x0(d.year)},0)`)
        .selectAll("rect")
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
        .datum(lineData)
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
        .style("text-anchor", "end")
        .text(d => d);
}

// general three
export function startTempAnomalyVisualization() {
    d3.json('./data/temp_month.json').then(function(data) {
        console.log('데이터 로드 성공:', data);  // 데이터가 제대로 로드되었는지 확인

        const margin = { top: 20, right: 30, bottom: 50, left: 70 },
            width = 800 - margin.left - margin.right,
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
                .style("opacity", 0.8);
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
            .style("font-weight", "bold")
            .text("Global temperature above preindustrial levels");
    }).catch(function(error) {
        console.error('데이터 로드 실패:', error);
    });
}

// 열사병: 열스트레스 그래프
export function startWBGTVisualization() {
    d3.json('data/wbgt_data_with_forecast.json').then(function(data) {
        console.log('데이터 로드 성공:', data);

        const margin = { top: 20, right: 100, bottom: 50, left: 70 },
            width = 800 - margin.left - margin.right,
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

        // 열 구역 배경을 그립니다.
        svg.append("rect")
            .attr("x", 0)
            .attr("y", y(35))
            .attr("width", width)
            .attr("height", y(32) - y(35))
            .attr("fill", "red")
            .style("opacity", 0.3);

        svg.append("rect")
            .attr("x", 0)
            .attr("y", y(32))
            .attr("width", width)
            .attr("height", y(30) - y(32))
            .attr("fill", "orange")
            .style("opacity", 0.3);

        svg.append("rect")
            .attr("x", 0)
            .attr("y", y(30))
            .attr("width", width)
            .attr("height", y(28) - y(30))
            .attr("fill", "yellow")
            .style("opacity", 0.3);

        // 모든 연도별 데이터를 그립니다.
        const years = d3.groups(data, d => d.year);

        // 우선 모든 회색 선을 그립니다.
        years.forEach(([year, values]) => {
            if (year !== 2024 && year !== 2050 && year !== 2023) {
                svg.append("path")
                    .datum(values)
                    .attr("fill", "none")
                    .attr("stroke", "#a9a9a9")
                    .attr("stroke-width", 1.5)
                    .attr("d", line);
            }
        });

        // 검은색, 빨간색, 파란색 선을 그립니다.
        [2023, 2024, 2050].forEach(targetYear => {
            const yearData = years.find(([year, _]) => year === targetYear)[1];
            svg.append("path")
                .datum(yearData)
                .attr("fill", "none")
                .attr("stroke", targetYear === 2024 ? "red" : targetYear === 2050 ? "blue" : "#333333")
                .attr("stroke-width", 2.5)
                .attr("stroke-dasharray", targetYear === 2050 ? "5,5" : "none")
                .attr("d", line);
        });

        // x축과 y축을 추가합니다.
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m-%d")));

        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d => `${d}°C`));

        // 그래프 제목을 추가합니다.
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Summer Daily WBGT Trends (1974-2024)");

        // 범례 추가
        const legendData = [
            { name: '1974-2022', color: '#a9a9a9', width: 1.5, dasharray: 'none' },
            { name: '2023', color: '#333333', width: 1.5, dasharray: 'none' },
            { name: '2024', color: 'red', width: 2.5, dasharray: 'none' },
            { name: '2050 (predicted)', color: 'blue', width: 2.5, dasharray: '5,5' }
        ];

        const legend = svg.selectAll(".legend")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width + 20}, ${i * 20})`);

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
            .style("text-anchor", "start")
            .text(d => d.name);
    }).catch(function(error) {
        console.error('데이터 로드 실패:', error);
    });
}