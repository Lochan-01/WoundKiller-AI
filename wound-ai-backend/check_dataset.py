#!/usr/bin/env python3
"""
check_dataset.py - verify wound dataset before training
"""

import os
import sys

def check_pairing(images_dir, masks_dir):
    images = sorted([f for f in os.listdir(images_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    masks = sorted([f for f in os.listdir(masks_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

    mask_lookup = {os.path.splitext(m)[0]: m for m in masks}
    pairs, missing_masks = [], []

    for img_file in images:
        base = os.path.splitext(img_file)[0]

        if base in mask_lookup:
            pairs.append((img_file, mask_lookup[base]))
        else:
            img_clean = base.replace("_image", "").replace("_img", "").replace("image", "").replace("img", "")
            found = False
            for mask_base, mask_file in mask_lookup.items():
                mask_clean = mask_base.replace("_mask", "").replace("_gt", "").replace("mask", "").replace("gt", "")
                if img_clean == mask_clean:
                    pairs.append((img_file, mask_file))
                    found = True
                    break
            if not found:
                missing_masks.append(img_file)

    return pairs, missing_masks, images, masks


if __name__ == "__main__":
    print("Python version:", sys.version)
    cwd = os.getcwd()
    print("Current directory:", cwd)

    paths = {
        "train_images": "data/train/images/train_images",
        "train_masks": "data/train/masks/train_masks",
        "val_images": "data/val/images/test_images",
        "val_masks": "data/val/masks/test_masks",
    }

    for name, path in paths.items():
        exists = os.path.exists(path)
        count = len(os.listdir(path)) if exists else 0
        print(f"{name:12} -> exists: {exists}, files: {count}")

    print("\n=== Checking pairings ===")

    # Training
    pairs, missing, imgs, masks = check_pairing(paths["train_images"], paths["train_masks"])
    print(f"Train: {len(imgs)} images, {len(masks)} masks, {len(pairs)} pairs")
    if missing:
        print(f"⚠ Missing masks for {len(missing)} images (first 5): {missing[:5]}")
    else:
        print("✅ All training images have masks")
    print(f"Sample training pair: {pairs[0] if pairs else 'None'}")

    # Validation
    pairs, missing, imgs, masks = check_pairing(paths["val_images"], paths["val_masks"])
    print(f"Val: {len(imgs)} images, {len(masks)} masks, {len(pairs)} pairs")
    if missing:
        print(f"⚠ Missing masks for {len(missing)} images (first 5): {missing[:5]}")
    else:
        print("✅ All validation images have masks")
    print(f"Sample validation pair: {pairs[0] if pairs else 'None'}")