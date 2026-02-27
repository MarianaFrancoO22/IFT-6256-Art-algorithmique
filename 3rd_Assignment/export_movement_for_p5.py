#!/usr/bin/env python3
"""
Export movement/timeseries/*.txt to JSON for p5.js.
Each file: 1024 rows (or 2048 split into two 1024-row segments), 7 columns (channels).
Output: data/movement.json with a sampled set of recordings for the sketch.
"""

import csv
import json
from pathlib import Path
from collections import defaultdict
from typing import List, Dict, Any

ROWS_PER_RECORD = 1024
MAX_SUBJECTS = 8
MAX_PER_SUBJECT = 9  # so one canvas shows up to 9 recordings in a grid


def parse_file(path: Path) -> List[List[float]]:
    """Read a .txt file; return list of 1024-row blocks (1 or 2 if 2048 rows)."""
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = [float(x) for x in line.split(",")]
            if len(parts) >= 7:
                rows.append(parts[:7])
            elif len(parts) > 0:
                rows.append(parts + [0.0] * (7 - len(parts)))
    if len(rows) < ROWS_PER_RECORD:
        return []
    blocks = []
    if len(rows) >= ROWS_PER_RECORD:
        blocks.append(rows[:ROWS_PER_RECORD])
    if len(rows) >= 2048:
        blocks.append(rows[ROWS_PER_RECORD : 2 * ROWS_PER_RECORD])
    return blocks


def main():
    timeseries_dir = Path("movement/timeseries")
    if not timeseries_dir.is_dir():
        raise SystemExit("movement/timeseries/ not found")

    # Group file paths by subject so we get several recordings per subject (for grid view)
    files_by_subject = defaultdict(list)
    for txt_path in sorted(timeseries_dir.glob("*.txt")):
        name = txt_path.stem  # e.g. 467_HoldWeight_RightWrist
        parts = name.split("_")
        if len(parts) < 3:
            continue
        subject_id = parts[0]
        files_by_subject[subject_id].append(txt_path)

    chosen = []
    subject_ids = sorted(files_by_subject.keys())[:MAX_SUBJECTS]
    for subject_id in subject_ids:
        count = 0
        for txt_path in files_by_subject[subject_id]:
            if count >= MAX_PER_SUBJECT:
                break
            parts = txt_path.stem.split("_")
            task = "_".join(parts[1:-1])
            wrist = parts[-1]
            blocks = parse_file(txt_path)
            for seg_idx, data in enumerate(blocks):
                if count >= MAX_PER_SUBJECT:
                    break
                chosen.append({
                    "subjectId": subject_id,
                    "task": task,
                    "wrist": wrist,
                    "segment": seg_idx + 1 if len(blocks) > 1 else 1,
                    "data": data,
                })
                count += 1

    out = {
        "recordings": chosen,
        "nChannels": 7,
        "nPoints": ROWS_PER_RECORD,
        "tasks": list(set(r["task"] for r in chosen)),
    }

    out_dir = Path("data")
    out_dir.mkdir(exist_ok=True)
    out_path = out_dir / "movement.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, separators=(",", ":"))

    print("Wrote", out_path, "| recordings:", len(chosen), "| subjects:", subject_ids)
    print("Next: python3 -m http.server 8000 then open http://localhost:8000")


if __name__ == "__main__":
    main()
