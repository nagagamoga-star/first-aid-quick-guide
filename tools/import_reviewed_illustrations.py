#!/usr/bin/env python3
"""Validate and stage independently approved medical illustrations; never publish them automatically."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

def require(ok, message):
    if not ok:
        raise SystemExit("BLOCKED: " + message)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--gallery", required=True, help="Extracted 42-image review gallery")
    p.add_argument("--decisions", required=True, help="Signed-off decisions JSON, based on approvals-template.json")
    p.add_argument("--repo", default=".")
    p.add_argument("--stage", action="store_true", help="Stage approved assets; default is dry run")
    a = p.parse_args()
    repo, gallery = Path(a.repo).resolve(), Path(a.gallery).resolve()
    require((repo / "data/media.json").is_file(), "Run from the first-aid repository")
    manifest = json.loads((gallery / "manifest.json").read_text(encoding="utf-8"))
    approvals = json.loads(Path(a.decisions).read_text(encoding="utf-8"))
    require(isinstance(approvals.get("approvals"), list), "Missing approvals array")
    items = {x["id"]: x for x in manifest["items"]}
    approved, keys = [], set()
    for decision in approvals["approvals"]:
        if decision.get("decision") != "APPROVE":
            continue
        for field in ("id", "sha256", "reviewer", "qualification", "reviewedAt",
                      "sourceConfirmedBy", "ownerApprovedBy", "ownerApprovedAt",
                      "stepKey", "alt", "caption"):
            require(decision.get(field), f"{decision.get('id', '?')}: missing {field}")
        item = items.get(decision["id"])
        require(item is not None, "Unknown illustration ID")
        require(decision["stepKey"] not in ("infant", "twofinger", "still", "handpos"),
                "Previously hidden clinical diagram needs separate documented exception")
        require(decision["stepKey"] not in keys, "Duplicate step mapping")
        keys.add(decision["stepKey"])
        filename = Path(item["filename"])
        require(filename.name == str(filename) and filename.suffix == ".webp", "Unsafe asset path")
        asset = gallery / "assets" / filename
        require(asset.is_file(), f"Missing asset: {filename}")
        digest = hashlib.sha256(asset.read_bytes()).hexdigest()
        require(digest == item["sha256"] == decision["sha256"], "Asset hash mismatch")
        approved.append((decision, item, asset))
    require(approved, "No clinically approved and owner-authorised images")
    print(f"Validated {len(approved)} approved image candidates.")
    if not a.stage:
        print("Dry run only. Use --stage to copy approved assets into a review-only directory.")
        return
    target = repo / "assets/diagrams/review-approved"
    target.mkdir(parents=True, exist_ok=True)
    output = []
    for decision, item, asset in approved:
        dest = target / item["filename"]
        shutil.copyfile(asset, dest)
        output.append({
            "id": decision["id"], "keys": [decision["stepKey"]],
            "file": dest.relative_to(repo).as_posix(), "sha256": item["sha256"],
            "alt": decision["alt"], "caption": decision["caption"],
            "source": "Original generated illustration", "status": "STAGED_NOT_PUBLISHED",
            "reviewerCode": decision["reviewer"], "qualification": decision["qualification"],
            "reviewedAt": decision["reviewedAt"],
            "ownerApprovedAt": decision["ownerApprovedAt"]
        })
    (repo / "data/approved-illustration-import.json").write_text(
        json.dumps({"status": "STAGED_NOT_PUBLISHED", "items": output}, indent=2) + "\n",
        encoding="utf-8"
    )
    print("Staged for code and clinical review; data/media.json and live site unchanged.")

if __name__ == "__main__":
    main()
