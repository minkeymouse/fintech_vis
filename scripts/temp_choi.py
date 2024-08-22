import pandas as pd
import numpy as np
import json

# CSV 파일 읽기
df_summer = pd.read_csv('./data/summer.csv')
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

# JSON 데이터 생성
json_data = []

re_idx = []
for i in np.arange(15, 40, 0.1):
    i = round(i, 1)
    re_idx.append(i)

# 각 년 단위 구간에 대해 데이터 추가
for idx, period in enumerate(unique_periods):
    filtered_df = df_summer[df_summer['구간'] == period]

    temp_counts = filtered_df['최고기온(℃)'].value_counts().reindex(re_idx, fill_value=0).sort_index()
    
    period_data = {
        'period': period,
        'data': []
    }
    
    for temp, freq in temp_counts.items():
        period_data['data'].append({
            'temperature': temp,
            'frequency': freq / len(filtered_df),
            'color': color_map[temp]
        })
    
    json_data.append(period_data)

# JSON 파일로 저장
with open('./data/data_for_choi.json', 'w') as f:
    json.dump(json_data, f, indent=4)

print("JSON 파일로 저장이 완료되었습니다.")