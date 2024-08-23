import geopandas as gpd

# Shapefile 데이터를 읽어들입니다.
shapefile_path = "./data/gadm41_KOR_0.shp"
gdf = gpd.read_file(shapefile_path)

# GeoJSON으로 변환하여 저장합니다.
geojson_path = "./data/korea_geojson.json"
gdf.to_file(geojson_path, driver="GeoJSON")