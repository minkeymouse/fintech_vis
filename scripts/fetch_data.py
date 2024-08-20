import requests
import os

# The URL provided by the API creator
api_url = "https://apihub.kma.go.kr/api/typ05/api/GK2A/LE2/QPN/KO/data?sdate=202312012350&eDate=202312120000&authKey=rBhoeJUrSEiYaHiVK4hIPg"

def fetch_and_save_data(url, filename):
    # Send the request to the API
    response = requests.get(url)
    
    # Check for errors in the response
    if response.status_code == 200:
        # Save the file to the appropriate directory
        os.makedirs("data", exist_ok=True)
        save_path = f"data/{filename}"
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"Data saved successfully to {save_path}.")
    else:
        print(f"Failed to fetch data. HTTP Status Code: {response.status_code} - {response.text}")

# Fetch and save data using the provided URL
fetch_and_save_data(api_url, "fetched_data.json")


