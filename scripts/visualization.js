// scripts/visualization.js

// D3.js 시각화 함수 정의
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

// scripts/visualization.js

// scripts/visualization.js

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

        function drawInitialPeriod() {
            const initialPeriodData = data[0];
            svg.selectAll(".initial-bar")
                .data(initialPeriodData.data, d => d.temperature)
                .enter()
                .append("rect")
                .attr("class", "initial-bar")
                .attr("x", d => x(d.temperature))
                .attr("y", y(0))
                .attr("height", 0)
                .attr("width", width / 250)
                .attr("fill", d => d.color)
                .transition()
                .duration(2000) // 애니메이션 시간을 늘림
                .ease(d3.easeCubic)  // 스무딩 애니메이션 적용
                .attr("y", d => y(d.frequency))
                .attr("height", d => height - y(d.frequency))
                .attr("opacity", 1)
                .on("end", function() {
                    d3.select(this)
                        .transition()
                        .duration(1000)
                        .attr("fill", "#000000")
                        .attr("opacity", 0.3); // 검은색으로 전환
                });
        }

        let currentPeriod = 1;

        function drawNextPeriod() {
            if (currentPeriod >= data.length) {
                svg.selectAll(".bar").remove();  // 모든 막대 제거
                currentPeriod = 0;  // 첫 번째 기간으로 초기화
                drawInitialPeriod(); // 첫 번째 기간 다시 그리기
                setTimeout(drawNextPeriod, 1000); // 지연 시간 후 다음 기간 그리기
                return;
            }

            const periodData = data[currentPeriod];

            // 이전 막대들 제거
            svg.selectAll(".bar")
                .transition()
                .duration(1000)
                .attr("opacity", 0)
                .remove();  // 이전 막대를 완전히 제거

            // 새 막대 추가
            svg.selectAll(`.bar-${currentPeriod}`)
                .data(periodData.data, d => d.temperature)
                .enter()
                .append("rect")
                .attr("class", `bar`)
                .attr("x", d => x(d.temperature))
                .attr("y", y(0))
                .attr("height", 0)
                .attr("width", width / 250)
                .attr("fill", d => d.color)
                .attr("opacity", 0)  // 초기 투명도 설정
                .transition()
                .duration(1000)
                .ease(d3.easeCubic)  // 스무딩 애니메이션 적용
                .attr("y", d => y(d.frequency))
                .attr("height", d => height - y(d.frequency))
                .attr("opacity", 0.8);  // 최종 불투명도 설정

            // 텍스트 업데이트
            periodLabel.text(periodData.period);

            currentPeriod++;
            setTimeout(drawNextPeriod, 3000);
        }

        drawInitialPeriod();
        setTimeout(drawNextPeriod, 3000); // 첫 번째 기간 후 3초 후에 다음 기간 시작
    }).catch(error => {
        console.error("Error loading JSON data:", error); // JSON 로드 에러 확인
    });
}


// Rainfall Network Visualization
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
            .attr("fill", "#e0e0e0")
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
                    .range([5, 20]);

                const colorScale = d3.scaleSequential(d3.interpolateBlues)
                    .domain([0, d3.max(nodes, d => d.rainfall)]);

                // 이전 요소 제거
                svg.selectAll(".node").remove();
                svg.selectAll(".link").remove();

                // 연결선 그리기
                svg.append("g")
                    .selectAll(".link")
                    .data(links)
                    .enter().append("line")
                    .attr("class", "link")
                    .attr("x1", d => projection([d.source.longitude, d.source.latitude])[0])
                    .attr("y1", d => projection([d.source.longitude, d.source.latitude])[1])
                    .attr("x2", d => projection([d.target.longitude, d.target.latitude])[0])
                    .attr("y2", d => projection([d.target.longitude, d.target.latitude])[1])
                    .style("stroke-width", d => Math.sqrt(d.weight))
                    .style("stroke", d => colorScale(d.weight))
                    .style("stroke-opacity", 0.6);

                // 노드 그리기
                svg.append("g")
                    .selectAll(".node")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", d => sizeScale(d.rainfall))
                    .attr("cx", d => projection([d.longitude, d.latitude])[0])
                    .attr("cy", d => projection([d.longitude, d.latitude])[1])
                    .style("fill", d => d.rainfall >= 0.1 ? colorScale(d.rainfall) : "#FFD700");

                // 월 표시
                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", 30)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "24px")
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
                if (year >= 2010) {
                    intervalSpeed = 3000;  // 2010년 이후 속도 느림
                } else {
                    intervalSpeed = 1000;  // 2010년 이전 속도 빠름
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