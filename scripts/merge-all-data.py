#!/usr/bin/env python3
"""Merge all researched OS data into seed-data.json."""
import json
import sys
from pathlib import Path

SCRIPTS = Path(__file__).parent

def load_json(path):
    with open(path) as f:
        return json.load(f)

def main():
    seed = load_json(SCRIPTS / "seed-data.json")

    # --- 1. Update platforms ---
    existing_platform_names = {p["name"] for p in seed["platforms"]}

    new_platforms = [
        {"name": "tvOS", "slug": "tvos", "color": "#34C759", "sortOrder": 5},
        {"name": "visionOS", "slug": "visionos", "color": "#6E5494", "sortOrder": 6},
    ]
    for p in new_platforms:
        if p["name"] not in existing_platform_names:
            seed["platforms"].append(p)
            print(f"  Added platform: {p['name']}")

    # Sort platforms by sortOrder
    seed["platforms"].sort(key=lambda p: p["sortOrder"])

    # --- 2. Load new version data ---
    ios_versions = load_json(SCRIPTS / "ios-all-versions.json")
    print(f"  iOS: {len(ios_versions)} versions from research")

    watchos_path = SCRIPTS / "watchos-versions.json"
    tvos_path = SCRIPTS / "tvos-versions.json"
    visionos_path = SCRIPTS / "visionos-versions.json"

    watchos_versions = load_json(watchos_path) if watchos_path.exists() else []
    tvos_versions = load_json(tvos_path) if tvos_path.exists() else []
    visionos_versions = load_json(visionos_path) if visionos_path.exists() else []

    print(f"  watchOS: {len(watchos_versions)} versions")
    print(f"  tvOS: {len(tvos_versions)} versions")
    print(f"  visionOS: {len(visionos_versions)} versions")

    # --- 3. Keep iPadOS and macOS, replace iOS and watchOS, add tvOS and visionOS ---
    kept = [v for v in seed["releaseVersions"] if v["platform"] in ("iPadOS", "macOS")]
    print(f"  Keeping {len(kept)} iPadOS + macOS versions")

    all_versions = kept + ios_versions + watchos_versions + tvos_versions + visionos_versions
    seed["releaseVersions"] = all_versions
    print(f"  Total versions: {len(all_versions)}")

    # --- 4. Generate release trains for ALL platforms ---
    # Collect unique (platform, majorVersion) pairs
    train_keys = set()
    for v in all_versions:
        train_keys.add((v["platform"], v["majorVersion"]))

    # Also keep existing trains (they may have displayName/releaseYear we want to preserve)
    existing_trains = {(t["platform"], t["majorVersion"]): t for t in seed["releaseTrains"]}

    # Year mapping for display names
    version_year_map = {
        # macOS codenames
        ("macOS", 26): ("macOS 26 Tahoe", 2025),
        ("macOS", 15): ("macOS 15 Sequoia", 2024),
        ("macOS", 14): ("macOS 14 Sonoma", 2023),
        ("macOS", 13): ("macOS 13 Ventura", 2022),
        ("macOS", 12): ("macOS 12 Monterey", 2021),
        ("macOS", 11): ("macOS 11 Big Sur", 2020),
        ("macOS", 10): ("macOS 10", 2001),
    }

    new_trains = []
    for platform, major in sorted(train_keys):
        key = (platform, major)
        if key in existing_trains:
            new_trains.append(existing_trains[key])
        else:
            # Auto-generate train
            display, year = version_year_map.get(key, (f"{platform} {major}", None))

            # Guess year from earliest milestone date in this platform/major
            if year is None:
                dates = []
                for v in all_versions:
                    if v["platform"] == platform and v["majorVersion"] == major:
                        if v.get("publicReleaseDate"):
                            dates.append(v["publicReleaseDate"])
                        elif v.get("milestones"):
                            dates.append(v["milestones"][0]["date"])
                if dates:
                    year = int(min(dates)[:4])
                else:
                    year = 2020

            train = {
                "platform": platform,
                "majorVersion": major,
                "displayName": display,
                "releaseYear": year,
            }
            new_trains.append(train)

    # Sort trains by platform then majorVersion descending
    platform_order = {p["name"]: p["sortOrder"] for p in seed["platforms"]}
    new_trains.sort(key=lambda t: (platform_order.get(t["platform"], 99), -t["majorVersion"]))
    seed["releaseTrains"] = new_trains
    print(f"  Release trains: {len(new_trains)}")

    # --- 5. Write output ---
    output = SCRIPTS / "seed-data.json"
    with open(output, "w") as f:
        json.dump(seed, f, indent=2)
        f.write("\n")

    print(f"\n  Written to {output}")

    # --- 6. Validate ---
    # Check for duplicate versions
    seen = set()
    dupes = []
    for v in seed["releaseVersions"]:
        key = (v["platform"], v["version"])
        if key in seen:
            dupes.append(key)
        seen.add(key)

    if dupes:
        print(f"\n  WARNING: {len(dupes)} duplicate versions found:")
        for p, ver in dupes[:10]:
            print(f"    {p} {ver}")

    # Check all versions have a matching train
    train_set = {(t["platform"], t["majorVersion"]) for t in seed["releaseTrains"]}
    orphans = []
    for v in seed["releaseVersions"]:
        if (v["platform"], v["majorVersion"]) not in train_set:
            orphans.append((v["platform"], v["version"], v["majorVersion"]))

    if orphans:
        print(f"\n  WARNING: {len(orphans)} versions without matching trains:")
        for p, ver, major in orphans[:10]:
            print(f"    {p} {ver} (major={major})")

    if not dupes and not orphans:
        print("\n  All validations passed!")

    # Summary by platform
    print("\n  Summary by platform:")
    for p in seed["platforms"]:
        count = sum(1 for v in seed["releaseVersions"] if v["platform"] == p["name"])
        trains = sum(1 for t in seed["releaseTrains"] if t["platform"] == p["name"])
        print(f"    {p['name']}: {count} versions, {trains} trains")

if __name__ == "__main__":
    main()
