# Weathering with Fintech (날씨의 아이들)

**Live demo:** [https://minkeymouse.github.io/fintech_vis/](https://minkeymouse.github.io/fintech_vis/)

A single-page data visualization project on climate change in Korea, built with D3.js and Korean Meteorological Administration (KMA) data. Part of a fintech-program visualization course; the theme is weather and climate impact, not finance.

---

## Team (4조)

김태린, 박가희, 이한상, 장민기, 최윤서

---

## Project overview

The site presents four main sections:

1. **한국의 기온 상승** — Temperature rise in Korea: past vs baseline (1908–1960) anomalies, summer daily max temperature histograms (1973–2023), monthly mean temperature by year (1965–2024), and a “Korea barcode” climate strip.
2. **폭염과 열사병** — Heat waves and heat stress: frequency of extreme heat days (1973–2024), weather-disaster deaths (2011–2019), and summer WBGT (heat stress index) trend with 2050 forecast.
3. **기후 변화로 인한 한국 생태계 변화** — Ecosystem impact: Seoul June average temperature vs lovebug complaint counts (2022–2023) by district.
4. **해수면 상승과 강수량 변화** — Sea level and rainfall: seasonal rainfall network (554 stations), local heavy-rainfall network change, annual mean sea level deviation (21 stations, 1989–2020), and RCP 4.5/8.5 flood scenario (2050/2100) treemap (Yeouido-area comparison).

All copy is in Korean; data sources are KMA, ACGIH, Seoul Metropolitan Government, KHOA, and KOEM (see Reference section on the site).

---

## Tech stack

- **Front end:** HTML5, CSS (SASS), JavaScript (ES modules)
- **Charts:** [D3.js v7](https://d3js.org/)
- **Layout / UX:** [HTML5 UP – Big Picture](https://html5up.net/big-picture) (jQuery, Scrolly, Scrollex, Poptrox), Font Awesome
- **Data:** Preprocessed JSON and GeoJSON in `data/` (no build step; load via `d3.json()`)

---

## Repository structure

```
├── index.html          # Single-page markup and section structure
├── scripts/
│   ├── index.js        # Entry: IntersectionObserver triggers per section, runs chart functions when in view
│   └── visualization.js # All D3 chart logic (~1400 lines)
├── data/               # JSON and GeoJSON (temp, WBGT, rainfall, sea level, maps, scenarios)
├── assets/             # SASS, compiled CSS, jQuery plugins, webfonts
├── images/             # Static images (barcode, heat, seasonal thumbs/fulls)
└── README.md
```

Charts are rendered into divs such as `#visualization-one`, `#visualization-two`, `#temp-anomaly-chart`, `#heatstroke_one_graph`, `#heatstroke_two_graph`, `#map-2022`, `#map-2023`, `#rainfall_map`, `#sea_level_chart`, and `#treemap`. Lazy initialization is used so each visualization runs when its section is scrolled into view.

---

## Running locally

No build step is required. Serve the project root over HTTP (e.g. with a local server) so that `d3.json("data/...")` and asset paths resolve correctly.

```bash
# Example: Python 3
python -m http.server 8000
# Open http://localhost:8000
```

Or use any static server (e.g. `npx serve .`) and open the URL it prints.

---

## Data sources (출처)

- [기상청](https://data.kma.go.kr/cmmn/main.do) (KMA)
- [미국 산업위생협회 (ACGIH)](https://www.acgih.org/)
- [서울시 시민건강국](https://archives.seoul.go.kr/authority/ORG-01075)
- [국립해양조사원](https://www.khoa.go.kr/) (KHOA)
- [해양환경공단](https://www.koem.or.kr/site/koem/main.do) (KOEM)

---

## License and credits

- Site template: Big Picture by HTML5 UP (CCA 3.0)
- Icons: Font Awesome
- Visualization library: D3.js
