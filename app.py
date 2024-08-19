import streamlit as st
from insect_outbreak import display_insect_outbreak
from heatstroke import display_heatstroke
from flooding import display_flooding

st.title("Global Warming and Rising Temperature Effects")

st.markdown("""
### Explore the effects of global warming through specific examples:
- **Insect Outbreaks**
- **Heatstroke Cases**
- **Flooding Events**
Use the dropdown below to explore the data and see how these scenarios have evolved over time.
""")

# Dropdown for scenario selection
scenario = st.selectbox("Choose a Scenario", ["Insect Outbreak", "Heatstroke", "Flooding"])

# Display data and visualizations based on the selected scenario
if scenario == "Insect Outbreak":
    display_insect_outbreak()
elif scenario == "Heatstroke":
    display_heatstroke()
elif scenario == "Flooding":
    display_flooding()

st.markdown("### Conclusion")
st.write("This interactive visualization highlights the impacts of global warming on various environmental and health-related scenarios. Continued monitoring and action are essential.")

# Footer
st.markdown("##### Data Source: 기상청 API and other relevant sources")