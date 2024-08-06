import requests
import json

def get_ultra_srt_ncst(service_key, base_date, base_time, nx, ny, data_type='JSON', num_of_rows=10, page_no=1):
    """
    Fetch ultra short weather data from the API.

    Args:
        service_key (str): The API service key.
        base_date (str): The base date for the forecast in YYYYMMDD format.
        base_time (str): The base time for the forecast in HHMM format.
        nx (int): The X coordinate of the forecast point.
        ny (int): The Y coordinate of the forecast point.
        data_type (str, optional): The response data type (XML/JSON). Defaults to 'JSON'.
        num_of_rows (int, optional): The number of rows per page. Defaults to 10.
        page_no (int, optional): The page number. Defaults to 1.

    Returns:
        dict: The response data from the API.
    """
    url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"
    
    params = {
        'serviceKey': service_key,
        'numOfRows': num_of_rows,
        'pageNo': page_no,
        'dataType': data_type,
        'base_date': base_date,
        'base_time': base_time,
        'nx': nx,
        'ny': ny
    }
    
    response = requests.get(url, params=params)
    
    if data_type == 'JSON':
        return response.json()
    else:
        return response.text

# Example usage
service_key = "JmCV3SHZhm+JYPOm0EAw0EOO/lGtfgMEAofeIbguizmSCF+zI140H3hmQ62z5wxpByv4Lio7PdCxmtP18NxWbA=="
base_date = "20210628"
base_time = "0600"
nx = 55
ny = 127

data = get_ultra_srt_ncst(service_key, base_date, base_time, nx, ny)
print(json.dumps(data, indent=4, ensure_ascii=False))