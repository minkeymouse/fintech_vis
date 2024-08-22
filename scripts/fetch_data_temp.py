# import requests
# import re
# import csv

# # The URL provided by the API creator
# domain = 'https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd3.php?'
# tm1 = 'tm1=20240514&'
# tm2 = 'tm2=20240514&'
# stn_id = 'stn=0&'
# help = 'help=1&'
# auth = 'authKey=-9IQCdUWT9ySEAnVFs_c4Q'

# api_url = domain + tm1 + tm2 + stn_id + help + auth

# # API 요청 보내기
# response = requests.get(api_url)

# indices = {
#     "TM": 0,
#     "STN": 1,
#     "TA_AVG": 10,
# }

# # 응답 상태 확인
# if response.status_code == 200:
#     try:
#         # 응답을 텍스트로 받기 (JSON이 아닌 경우)
#         raw_data = response.text

#         # 결과를 CSV로 저장하기 위해 파일 오픈
#         with open('weather_data.csv', mode='w', newline='') as file:
#             writer = csv.writer(file)
#             # CSV 파일에 헤더 작성
#             writer.writerow(["TM", "STN", "TA_AVG"])

#             # 데이터 라인을 순회하면서 필요한 값을 추출
#             for line in raw_data.strip().splitlines():
#                 # 공백을 기준으로 데이터를 분리
#                 values = re.split(r'\s+', line)

#                 # 데이터가 필요한 길이를 가지고 있는지 확인
#                 if len(values) > max(indices.values()):
#                     tm = values[indices["TM"]]
#                     stn = values[indices["STN"]]
#                     ta_avg = values[indices["TA_AVG"]]
#                     writer.writerow([tm, stn, ta_avg])

#     except ValueError as e:
#         print("Failed to parse the data.")
#         print(response.text)
# else:
#     print(f"Error: {response.status_code}")

# import requests
# import re
# from collections import defaultdict

# # The URL provided by the API creator
# domain = 'https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd3.php?'
# tm1 = 'tm1=202401&'
# tm2 = 'tm2=202407&'
# help_param = 'help=1&'
# auth = 'authKey=-9IQCdUWT9ySEAnVFs_c4Q'

# # 추출하고자 하는 데이터의 인덱스
# indices = {
#     "TM": 0,
#     "STN": 1,
#     "TA_AVG": 10,
# }

# # ID 목록 (전국의 모든 지점)
# ids = [
#     90, 93, 95, 98, 99, 100, 101, 102, 104, 105, 106, 108, 112, 114, 115, 119, 
#     121, 127, 129, 130, 131, 133, 135, 136, 137, 138, 140, 143, 146, 152, 155, 
#     156, 159, 162, 165, 168, 169, 170, 172, 174, 177, 181, 184, 185, 188, 189, 
#     192, 201, 202, 203, 211, 212, 216, 217, 221, 226, 232, 235, 236, 238, 239, 
#     243, 244, 245, 247, 248, 251, 252, 253, 254, 255, 257, 258, 259, 260, 261, 
#     262, 263, 264, 266, 268, 271, 272, 273, 276, 277, 278, 279, 281, 283, 284, 
#     285, 288, 289, 294, 295
# ]

# # 데이터를 저장할 딕셔너리
# data_by_tm = defaultdict(lambda: defaultdict(list))

# # 각 ID에 대해 데이터를 추출
# for stn_id in ids:
#     # ID에 따라 URL 생성
#     stn_id_param = f'stn={stn_id}&'
#     api_url = domain + tm1 + tm2 + stn_id_param + help_param + auth

#     # API 요청 보내기
#     response = requests.get(api_url)

#     # 응답 상태 확인
#     if response.status_code == 200:
#         try:
#             # 응답을 텍스트로 받기 (JSON이 아닌 경우)
#             raw_data = response.text

#             # 데이터 라인을 순회하면서 필요한 값을 추출
#             for line in raw_data.strip().splitlines():
#                 # 공백을 기준으로 데이터를 분리
#                 values = re.split(r'\s+', line)

#                 # 첫 번째 필드(TM)가 날짜 형식인지 확인
#                 if re.match(r'^\d{8}$', values[indices["TM"]]):
#                     for key, index in indices.items():
#                         if key != "TM":  # TM은 제외
#                             try:
#                                 data_by_tm[values[indices["TM"]]][key].append(float(values[index]))
#                             except ValueError:
#                                 pass  # 숫자 변환 실패 시 무시

#         except ValueError as e:
#             print(f"Failed to parse the data for STN_ID: {stn_id}.")
#             print(response.text)
#     else:
#         print(f"Error: {response.status_code} for STN_ID: {stn_id}")

# # 전국 평균 계산
# national_averages = {}

# for tm, variables in data_by_tm.items():
#     national_averages[tm] = {var: sum(values) / len(values) for var, values in variables.items()}

# # 결과 출력 (처음 5개와 마지막 5개의 날짜에 대한 평균값)
# sorted_keys = sorted(national_averages.keys())

# # 처음 5개
# for tm in sorted_keys[:5]:
#     print(f"TM: {tm} - Nationwide Averages: {national_averages[tm]}")

# # 마지막 5개
# for tm in sorted_keys[-5:]:
#     print(f"TM: {tm} - Nationwide Averages: {national_averages[tm]}")


# import csv

# # CSV 파일로 저장할 경로 설정
# csv_file_path = 'national_averages.csv'

# # CSV 파일로 저장
# with open(csv_file_path, 'w', newline='') as csvfile:
#     # 헤더 설정 (TM과 나머지 변수들)
#     fieldnames = ['TM'] + [key for key in indices.keys() if key != 'STN']
#     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
#     # 헤더 작성
#     writer.writeheader()
    
#     # 데이터 작성
#     for tm, averages in national_averages.items():
#         # 'STN' 키가 있으면 제거하고 나머지 데이터만 사용
#         row = {'TM': tm}
#         for key, value in averages.items():
#             if key != 'STN':
#                 row[key] = value
#         writer.writerow(row)

# print(f"Data has been saved to {csv_file_path}")