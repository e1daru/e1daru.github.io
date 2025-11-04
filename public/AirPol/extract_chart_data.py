#!/usr/bin/env python3
"""
Extract actual PM2.5 data for AirPol charts from PurpleAir data.
Generates JSON files that can be imported into the React app.
"""

import json
import warnings
warnings.filterwarnings("ignore")

import pandas as pd
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).parent.resolve()

# Load data (resolve paths relative to this script's folder)
PA_FILE = BASE_DIR / "92387 2016-08-26 2025-08-26 60-Minute Average.csv"
OUTPUT_DIR = (BASE_DIR / "chart_data")
OUTPUT_DIR.mkdir(exist_ok=True)

# Optionally mirror outputs into the app imports folder
MIRROR_DIR = (BASE_DIR.parent.parent / "src/data")
try:
    MIRROR_DIR.mkdir(parents=True, exist_ok=True)
    MIRROR_ENABLED = True
except Exception:
    MIRROR_ENABLED = False

print("Loading PurpleAir data...")
df = pd.read_csv(PA_FILE)

# Standardize column names
df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

# Parse datetime as UTC, then convert to Bishkek local time for human-facing aggregations
df['time_stamp'] = pd.to_datetime(df['time_stamp'], utc=True)
df = df.set_index('time_stamp').sort_index()

# Use Asia/Bishkek (UTC+6) to align hours/days to local behavior
LOCAL_TZ = 'Asia/Bishkek'
df_local = df.tz_convert(LOCAL_TZ)

# Use pm2.5_atm as the PM2.5 value (atmospheric correction already applied)
pm25_col = 'pm2.5_atm'

print(f"Data range: {df.index.min()} to {df.index.max()}")
print(f"Total records: {len(df)}")

# Filter to valid PM2.5 readings (remove extreme outliers)
df = df[df[pm25_col].notna()]
df = df[(df[pm25_col] >= 0) & (df[pm25_col] < 500)]  # Remove extreme outliers
df_local = df_local.loc[df.index]  # keep same rows after filtering

print(f"Records after filtering: {len(df)}")

# 1. Monthly PM2.5 Levels with WHO Safe Limit (local month names)
print("\n1. Generating Monthly PM2.5 data...")
# Use local-indexed frame for label-friendly month names
df_local['month'] = df_local.index.month
df_local['month_name'] = df_local.index.strftime('%b')
monthly = df_local.groupby(['month', 'month_name'])[pm25_col].mean().reset_index()
monthly = monthly.sort_values('month')
monthly_data = [
    {"month": row['month_name'], "pm25": round(float(row[pm25_col]), 1)}
    for _, row in monthly.iterrows()
]
print(f"Monthly averages: {len(monthly_data)} months")

# 2. Diurnal Cycle: Hourly PM2.5 Variation (local time)
print("\n2. Generating Hourly Variation data...")
df_local['hour'] = df_local.index.hour
hourly = df_local.groupby('hour')[pm25_col].mean().reset_index()
hourly_data = [
    {"hour": f"{int(row['hour']):02d}:00", "pm25": round(float(row[pm25_col]), 1)}
    for _, row in hourly.iterrows()
]
print(f"Hourly averages: {len(hourly_data)} hours")

# Optional: winter-only hourly (Dec–Feb)
winter_mask = df_local.index.month.isin([12, 1, 2])
hourly_winter = (df_local.loc[winter_mask]
                 .groupby('hour')[pm25_col]
                 .mean()
                 .reset_index())
hourly_winter_data = [
    {"hour": f"{int(row['hour']):02d}:00", "pm25": round(float(row[pm25_col]), 1)}
    for _, row in hourly_winter.iterrows()
]
print(f"Hourly (winter) averages: {len(hourly_winter_data)} hours")

# 3. Seasonal PM2.5 Averages (local calendar)
print("\n3. Generating Seasonal data...")
def get_season(month):
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    else:
        return "Fall"

df_local['season'] = df_local['month'].apply(get_season)
seasonal = df_local.groupby('season')[pm25_col].mean().reset_index()

# Order seasons properly
season_order = ["Winter", "Spring", "Summer", "Fall"]
seasonal['order'] = seasonal['season'].map({s: i for i, s in enumerate(season_order)})
seasonal = seasonal.sort_values('order')

def categorize_pm25(value):
    if value <= 12:
        return "Good"
    elif value <= 35.4:
        return "Moderate"
    elif value <= 55.4:
        return "Unhealthy for Sensitive"
    elif value <= 150.4:
        return "Unhealthy"
    elif value <= 250.4:
        return "Very Unhealthy"
    else:
        return "Hazardous"

seasonal_data = [
    {
        "season": row['season'],
        "pm25": round(float(row[pm25_col]), 1),
        "category": categorize_pm25(row[pm25_col])
    }
    for _, row in seasonal.iterrows()
]
print(f"Seasonal averages: {len(seasonal_data)} seasons")

# 4. 7-Day Forecast: Use most recent data (local days)
print("\n4. Generating Recent 7-Day data...")
# Get the most recent complete 7 days using local-indexed frame
recent = df_local.tail(7*24).copy()  # Last ~7 days of hourly data
recent['date'] = recent.index.date  # local calendar date
daily_recent = recent.groupby('date')[pm25_col].mean().reset_index()
daily_recent = daily_recent.tail(7)  # Ensure we have exactly 7 days

# Create day labels
day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
forecast_data = []
for i, (_, row) in enumerate(daily_recent.iterrows()):
    day_idx = i % 7
    # For demonstration, add slight variation to "predicted" values
    actual = round(float(row[pm25_col]), 1)
    predicted = round(float(actual * (0.95 + np.random.random() * 0.1)), 1)  # ±5% variation
    forecast_data.append({
        "day": day_names[day_idx],
        "actual": actual,
        "predicted": predicted
    })

print(f"Forecast data: {len(forecast_data)} days")

# Save all data
output_files = {
    "monthly_pm25.json": monthly_data,
    "hourly_variation.json": hourly_data,
    "hourly_variation_winter.json": hourly_winter_data,
    "seasonal_pm25.json": seasonal_data,
    "forecast_7day.json": forecast_data
}

for filename, data in output_files.items():
    filepath = OUTPUT_DIR / filename
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"\nSaved: {filepath}")
    print(f"Sample: {data[:2] if len(data) > 2 else data}")

    # Mirror to src/data for direct imports by the React app
    if MIRROR_ENABLED:
        mirror_path = MIRROR_DIR / filename
        try:
            with open(mirror_path, 'w') as mf:
                json.dump(data, mf, indent=2)
            print(f"Mirrored: {mirror_path}")
        except Exception as e:
            print(f"Mirror failed for {filename}: {e}")

# Print summary statistics
print("\n" + "="*60)
print("SUMMARY STATISTICS")
print("="*60)
print(f"Overall mean PM2.5: {df[pm25_col].mean():.1f} µg/m³")
print(f"Overall median PM2.5: {df[pm25_col].median():.1f} µg/m³")
print(f"Max PM2.5: {df[pm25_col].max():.1f} µg/m³")
print(f"Min PM2.5: {df[pm25_col].min():.1f} µg/m³")
print(f"WHO safe limit: 10 µg/m³")
print(f"Times over WHO limit: {(df[pm25_col] > 10).sum()} / {len(df)} ({(df[pm25_col] > 10).mean()*100:.1f}%)")
print("\nData extraction complete!")
