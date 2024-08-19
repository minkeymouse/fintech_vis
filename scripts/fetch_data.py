import requests
import json
import os

# API setup
api_url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
api_key = "YOUR_API_KEY"  # Replace with your actual API key

# Parameters for the API request
params = {
    "serviceKey": api_key,
    "numOfRows": "100",
    "pageNo": "1",
    "dataType": "JSON",
    "base_date": "20230801",  # Example date
    "base_time": "0500",      # Example time
    "nx": "60",               # Example grid x coordinate
    "ny": "127"               # Example grid y coordinate
}

def fetch_and_save_data(filename, params):
    response = requests.get(api_url, params=params)
    data = response.json()
    
    os.makedirs("data", exist_ok=True)
    with open(f"data/{filename}", "w", encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Fetch data for each example
fetch_and_save_data("insect_outbreak_data.json", params)
fetch_and_save_data("heatstroke_data.json", params)
fetch_and_save_data("flooding_data.json", params)