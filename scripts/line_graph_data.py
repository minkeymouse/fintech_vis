import pandas as pd

# CSV 파일에서 데이터 로드
data = pd.read_csv('./data/combined_weighted_temp.csv')

# 'Date' 열을 datetime 형식으로 변환하여 연도와 월을 추출
data['Date'] = pd.to_datetime(data['Date'], format='%Y-%m')
data['Year'] = data['Date'].dt.year
data['Month'] = data['Date'].dt.month

# 월별 평균 온도 계산 (예제의 base line 역할)
numeric_cols = data.select_dtypes(include=['float64', 'int64']).columns
monthly_avg = data.groupby('Month')[numeric_cols].mean().round(2)

# 월별 평균 온도를 기반으로 한 dictionary 생성
weighted_temp_dict = monthly_avg['Weighted_Temp'].to_dict()

# 온도 이상치(Temperature Anomaly) 계산 (Weighted_Temp와 dict 값 비교)
data['temp_anomaly'] = data.apply(lambda row: row['Weighted_Temp'] - weighted_temp_dict[row['Month']], axis=1)

# 필요한 컬럼만 선택하여 JSON 파일로 저장
output_data = data[['Year', 'Month', 'temp_anomaly']]
output_data.to_json('./data/temp_anomaly.json', orient='records', date_format='iso')

print("Data has been successfully converted to JSON format and saved.")