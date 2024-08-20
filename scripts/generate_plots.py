import json
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Load data
with open("data/insect_outbreak_data.json", "r", encoding='utf-8') as f:
    insect_data = json.load(f)
with open("data/heatstroke_data.json", "r", encoding='utf-8') as f:
    heatstroke_data = json.load(f)
with open("data/flooding_data.json", "r", encoding='utf-8') as f:
    flooding_data = json.load(f)

# Convert data to DataFrame (example structure)
insect_df = pd.DataFrame(insect_data['response']['body']['items']['item'])
heatstroke_df = pd.DataFrame(heatstroke_data['response']['body']['items']['item'])
flooding_df = pd.DataFrame(flooding_data['response']['body']['items']['item'])

# Generate Seaborn plot for Insect Outbreak (General)
sns_plot = sns.lineplot(data=insect_df, x="fcstDate", y="fcstValue", hue="category")
sns_plot.set_title("Insect Outbreak Over Time (General Overview)")
sns_plot.figure.savefig("plots/insect_general.png")
plt.clf()

# Generate Case-Specific Map for Insect Outbreak
# Example: Using Plotly for a map visualization
fig = px.scatter_geo(insect_df, lat="latitude", lon="longitude", color="fcstValue",
                     size="fcstValue", hover_name="location", title="Insect Outbreak Map")
fig.update_geos(projection_type="natural earth")
fig.write_html("plots/insect_case_map.html")

# Generate Matplotlib plot for Heatstroke Cases (General)
plt.figure(figsize=(10, 6))
plt.plot(heatstroke_df['fcstDate'], heatstroke_df['fcstValue'], color='red', marker='o')
plt.title('Heatstroke Cases Over Time (General Overview)')
plt.xlabel('Date')
plt.ylabel('Number of Cases')
plt.savefig("plots/heatstroke_general.png")
plt.clf()

# Generate Animated Plotly Visualization for Heatstroke (Case-Specific)
animated_fig = px.bar(heatstroke_df, x="fcstDate", y="fcstValue", color="category",
                      animation_frame="fcstDate", range_y=[0, 100], title="Heatstroke Cases Over Time (Case-Specific)")
animated_fig.write_html("plots/heatstroke_case_animation.html")

# Generate Plotly plot for Flooding Events (General)
flooding_fig = px.line(flooding_df, x="fcstDate", y="fcstValue", color="category", title="Flooding Events Over Time (General Overview)")
flooding_fig.write_html("plots/flooding_general.html")

# Generate Auto-Updating Plot for Flooding Events (Case-Specific)
# Example: A Plotly line chart that would be refreshed with new data
# This part assumes some kind of scheduled job or manual refresh; for GitHub Pages, you'd manually refresh the data
auto_update_fig = px.line(flooding_df, x="fcstDate", y="fcstValue", color="category", title="Auto-Updated Flooding Data (Case-Specific)")
                          
auto_update_fig.write_html("plots/flooding_case_auto_update.html")
