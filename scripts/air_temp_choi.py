import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.express as px
import plotly.io as pio

df_summer = pd.read_csv('summer.csv')
unique_periods = df_summer['구간'].unique()

# 기온 구간 정의
bins_temp = [15, 22, 27.5, 29.5, 34, 40]
labels_temp = ['Extremely Cold', 'Cold', 'Normal', 'Hot', 'Extremely Hot']
colors_temp = ['#0033cc', '#74BFD1', '#d3d3d3', '#F4A474', '#cc0000']

# 기온 구간에 따라 색상 지정
color_map = {}

for i in range(5):
    b1, b2 = bins_temp[i], bins_temp[i+1]
    for j in np.arange(b1, b2, 0.1):
        j = round(j, 1)
        color_map[j] = colors_temp[i]

# 서브플롯 생성
fig = make_subplots(rows=len(unique_periods), cols=1, subplot_titles=unique_periods)

re_idx = []
for i in np.arange(15,40,0.1):
        i = round(i, 1)
        re_idx.append(i)

# 각 년 단위 구간에 대해 서브플롯 추가
for idx, period in enumerate(unique_periods):
    filtered_df = df_summer[df_summer['구간'] == period]

    temp_counts = filtered_df['최고기온(℃)'].value_counts().reindex(re_idx, fill_value=0)
    
    # Plotly Express로 막대 그래프 생성
    fig_period = px.bar(
        x=temp_counts.index,
        y=temp_counts.values/len(filtered_df),
        labels={'x': 'Temperature Category', 'y': 'Frequency'},
        title=period
    )
    
    # 막대의 색상을 업데이트
    for trace in fig_period.data:
        trace.marker.color = [color_map[cat] for cat in trace.x]
        trace.update(marker_line_width=0, width=0.1)
        fig.add_trace(trace, row=idx + 1, col=1)

# 레이아웃 설정
fig.update_layout(
    title_text='Histograms of Maximum Temperatures of Summer by 10-Year Periods',
    height=3000,
    width=800,
    showlegend=False,
    xaxis_title='Temperature Category',
    yaxis_title='Frequency',
    barmode='overlay',
    bargap=0,  # 막대 간격 제거
)

for i in range(1, 6):
    fig.update_xaxes(range=[15,40], row=i, col=1)
    fig.update_yaxes(range=[0,0.015], row=i, col=1)
    
# 그래프를 HTML 파일로 저장
# pio.write_html(fig, 'graph2_summer.html')
# 그래프 표시
fig.show()