import requests
import os

# The URL provided by the API creator
domain = 'https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd3.php?'
# norm = 'norm=D&'
tm = 'tm=2021&'
tm1 = 'tm1=20181211&'
tm2 = 'tm2=20240514&'
stn_id = 'stn=108&'
help = 'help=1&'
# option = 'MM1=5&DD1=1&MM2=5&DD2=2&'
auth = 'authKey=-9IQCdUWT9ySEAnVFs_c4Q'

api_url = domain + tm1 + tm2 + stn_id + help + auth

# API 요청 보내기
response = requests.get(api_url)

# 응답 상태 확인
if response.status_code == 200:
    try:
        # JSON 형식으로 데이터 파싱 시도
        data = response.json()
        # 데이터 출력 (예시)
        print(data)
    except requests.exceptions.JSONDecodeError:
        # JSONDecodeError가 발생하면 응답 내용을 출력
        print("Failed to decode JSON. Response content:")
        print(response.text)
else:
    print(f"Error: {response.status_code}")