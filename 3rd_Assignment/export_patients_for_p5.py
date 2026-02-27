#!/usr/bin/env python3
"""
Read patients/*.json and write data/patients.json for the p5 sketch.
Output: { "id": { "age", "height", "weight", "gender", "condition" }, ... }
"""

import json
from pathlib import Path


def main():
    patients_dir = Path("patients")
    out_path = Path("data/patients.json")
    if not patients_dir.is_dir():
        raise SystemExit("patients/ not found")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    by_id = {}
    for jpath in sorted(patients_dir.glob("patient_*.json")):
        with open(jpath, encoding="utf-8") as f:
            data = json.load(f)
        pid = data.get("id")
        if not pid:
            continue
        by_id[pid] = {
            "age": data.get("age"),
            "height": data.get("height"),
            "weight": data.get("weight"),
            "gender": data.get("gender"),
            "condition": data.get("condition"),
        }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(by_id, f, indent=0)
    print("Wrote", out_path, "| patients:", len(by_id))


if __name__ == "__main__":
    main()
