# Air Quality Data Analysis for Bishkek

This directory contains air quality data and analysis scripts for the AirPol page.

## Data Sources

- **PurpleAir sensor data**: `92387 2016-08-26 2025-08-26 60-Minute Average.csv`
  - Hourly PM2.5 measurements from 2020-2025
  - ~40,000 data points
  - Source: PurpleAir sensor #92387 in Bishkek

- **Weather data**: `meteostat_bishkek_hourly.csv`
  - Hourly meteorological data from 2021-2025
  - Temperature, humidity, wind speed, etc.
  - Source: Meteostat API

## Analysis Notebook

`first_analysis.ipynb` contains the full data science pipeline:
1. Data loading and cleaning
2. Exploratory data analysis
3. Statistical testing
4. Visualization
5. Modeling

## Chart Data Generation

The script `extract_chart_data.py` processes the raw data and generates JSON files for the website charts:

```bash
cd public/AirPol
python3 extract_chart_data.py
```

This creates four JSON files in `src/data/`:
- `monthly_pm25.json` - Monthly average PM2.5 levels
- `hourly_variation.json` - Average PM2.5 by hour of day
- `seasonal_pm25.json` - Seasonal averages with health categories
- `forecast_7day.json` - Recent 7-day actual values

## Key Findings

From analysis of ~40,000 hours of data (2020-2025):

- **Overall average**: 21.0 µg/m³ (2.1× WHO limit)
- **Exceeds WHO limit**: 53.5% of the time
- **Winter average**: 43.5 µg/m³ (Unhealthy for Sensitive Groups)
- **Summer average**: 9.2 µg/m³ (Good)
- **Peak month**: January (51.1 µg/m³)
- **Cleanest month**: June (7.1 µg/m³)

### Diurnal Pattern
- **Best air quality**: 5-9 AM (~12-13 µg/m³)
- **Worst air quality**: 4-6 PM (~32 µg/m³)
- Peak pollution in afternoon/evening due to heating and traffic

### Seasonal Variation
- **5× difference** between winter and summer
- Winter: 43.5 µg/m³ (coal heating season)
- Summer: 9.2 µg/m³ (no heating needed)
- Fall/Spring: Transition periods (13-19 µg/m³)

## Dependencies

Python packages required:
```bash
pip install pandas numpy matplotlib seaborn scipy statsmodels scikit-learn
```

## License

Data from PurpleAir and Meteostat are used under their respective terms of service.
Analysis and visualizations are part of the e1daru portfolio project.
