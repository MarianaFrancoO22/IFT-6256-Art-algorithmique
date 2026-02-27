# `sketch_movement.js` README

This README documents the movement sketch only (`index.html` + `sketch_movement.js`).

Uses `movement/timeseries/*.txt`: 1024 points × 7 channels per file (10.24 s). Files with 2048 rows are split into two segments. Tasks: HoldWeight, DrinkGlas, CrossArms, PointFinger, Entrainment, LiftHold, RelaxedTask, Relaxed, StretchHold, TouchIndex, TouchNose.

Channel schema:
- `Time` (s)
- `Accelerometer_X/Y/Z` (g)
- `Gyroscope_X/Y/Z` (rad/s)

## How to run

1. **Export movement data** (run once unless source files change):
   ```bash
   python3 export_movement_for_p5.py
   ```
   Creates `data/movement.json` (sampled recordings).

2. **Export patient metadata** (run once unless patient files change):
   ```bash
   python3 export_patients_for_p5.py
   ```
   Creates `data/patients.json`.

3. **Start a local server** in this folder:
   ```bash
   python3 -m http.server 8000
   ```

4. **Open in the browser:**
   **http://localhost:8000**  
   (`index.html` loads `sketch_movement.js`.)

**What you see (current sketch):**
- One subject at a time; click or SPACE/Right Arrow switches to next subject.
- For each recording, two separate signals are plotted (not mixed):
  - **Accel magnitude** (`sqrt(ax²+ay²+az²)`) = primary expressive curve.
  - **Gyro magnitude** (`sqrt(gx²+gy²+gz²)`) = secondary thinner companion curve.
- Background uses patient metadata words (age/height/weight/gender/condition) at low opacity.
- Visual style changes by patient condition:
  - **Parkinson's** → purple background family
  - **Healthy** → green background family
  - **Other Movement Disorders** → blue background family
- Randomized visual layers (glow/rungs/dots) are deterministic per subject/recording via seeded randomness.

**Files:** `index.html` (movement), `sketch_movement.js`, `export_movement_for_p5.py`, `export_patients_for_p5.py`, `data/movement.json`, `data/patients.json`.

## Dataset source (PADS)

This sketch uses the **PADS — Parkinson's Disease Smartwatch dataset** (PhysioNet, v1.0.0), which contains synchronized smartwatch acceleration and rotation recordings for three participant groups:
- Parkinson's disease (PD)
- Other movement disorders (differential diagnoses)
- Healthy controls

Key context used by this project:
- 469 participants
- 11 movement assessment tasks
- Two wrist-worn smartwatch streams
- Sensor channels include acceleration and gyroscope axes (plus time in exported timeseries)

Dataset:
- PhysioNet record: https://physionet.org/content/parkinsons-disease-smartwatch/1.0.0/
- DOI: https://doi.org/10.13026/m0w9-zx22
