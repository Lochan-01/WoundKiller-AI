import os, shutil, random, argparse
from PIL import Image

def ensure_dir(p): 
    os.makedirs(p, exist_ok=True)

def binarize_mask(src_path, dst_path, thresh=127):
    im = Image.open(src_path).convert('L')
    bw = im.point(lambda p: 255 if p > thresh else 0)
    bw.save(dst_path)

def find_mask_for_image(img_name, mask_files):
    base = os.path.splitext(img_name)[0]
    for m in mask_files:
        mbase = os.path.splitext(m)[0]
        if mbase == base or mbase.startswith(base) or base.startswith(mbase):
            return m
    return None

def main(images_dir, masks_dir, out_dir, train_ratio=0.8, seed=42):
    images = sorted([f for f in os.listdir(images_dir) if f.lower().endswith(('.jpg','.jpeg','.png'))])
    mask_files = sorted([f for f in os.listdir(masks_dir) if f.lower().endswith(('.png','.jpg','.jpeg'))])

    pairs = []
    missing_masks = []
    for im in images:
        m = find_mask_for_image(im, mask_files)
        if m:
            pairs.append((os.path.join(images_dir, im), os.path.join(masks_dir, m)))
        else:
            missing_masks.append(im)
    print(f"Found {len(pairs)} matched pairs, {len(missing_masks)} images missing masks.")

    random.seed(seed)
    random.shuffle(pairs)
    n_train = int(len(pairs) * train_ratio)
    splits = {'train': pairs[:n_train], 'val': pairs[n_train:]}

    for split, items in splits.items():
        for img_path, mask_path in items:
            dst_img = os.path.join(out_dir, split, 'images', os.path.basename(img_path))
            dst_mask = os.path.join(out_dir, split, 'masks', os.path.basename(mask_path))
            ensure_dir(os.path.dirname(dst_img))
            ensure_dir(os.path.dirname(dst_mask))
            shutil.copy2(img_path, dst_img)
            binarize_mask(mask_path, dst_mask)
    print("Done. Train:", len(splits['train']), "Val:", len(splits['val']))
    if missing_masks:
        print("Example missing mask files (first 10):", missing_masks[:10])

if _name_ == "_main_":
    parser = argparse.ArgumentParser()
    parser.add_argument('--images', required=True, help='path to source images folder')
    parser.add_argument('--masks', required=True, help='path to source masks folder')
    parser.add_argument('--out', default='data', help='output folder (will contain train/val)')
    parser.add_argument('--train-ratio', type=float, default=0.8)
    parser.add_argument('--seed', type=int, default=42)
    args = parser.parse_args()
    main(args.images, args.masks, args.out, args.train_ratio, args.seed)