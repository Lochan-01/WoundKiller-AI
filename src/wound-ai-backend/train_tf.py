import os
import argparse
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

# -----------------------------
# Dataset Loader
# -----------------------------
def load_image(path, target_size=(128, 128)):
    img = tf.keras.utils.load_img(path, target_size=target_size)
    img = tf.keras.utils.img_to_array(img)
    img = img / 255.0
    return img

def load_mask(path, target_size=(128, 128)):
    mask = tf.keras.utils.load_img(path, target_size=target_size, color_mode="grayscale")
    mask = tf.keras.utils.img_to_array(mask)
    mask = mask / 255.0
    mask = np.round(mask)  # make sure mask is binary (0 or 1)
    return mask

def load_dataset(image_dir, mask_dir, img_size=(128, 128)):
    images = sorted([os.path.join(image_dir, f) for f in os.listdir(image_dir) if f.endswith(('.jpg','.png','.jpeg'))])
    masks = sorted([os.path.join(mask_dir, f) for f in os.listdir(mask_dir) if f.endswith(('.jpg','.png','.jpeg'))])

    X, Y = [], []
    for img_path, mask_path in zip(images, masks):
        X.append(load_image(img_path, img_size))
        Y.append(load_mask(mask_path, img_size))

    return np.array(X), np.array(Y)

# -----------------------------
# U-Net Model
# -----------------------------
def unet_model(input_size=(128,128,3)):
    inputs = layers.Input(input_size)

    # Encoder
    c1 = layers.Conv2D(64, (3,3), activation='relu', padding='same')(inputs)
    c1 = layers.Conv2D(64, (3,3), activation='relu', padding='same')(c1)
    p1 = layers.MaxPooling2D((2,2))(c1)

    c2 = layers.Conv2D(128, (3,3), activation='relu', padding='same')(p1)
    c2 = layers.Conv2D(128, (3,3), activation='relu', padding='same')(c2)
    p2 = layers.MaxPooling2D((2,2))(c2)

    c3 = layers.Conv2D(256, (3,3), activation='relu', padding='same')(p2)
    c3 = layers.Conv2D(256, (3,3), activation='relu', padding='same')(c3)
    p3 = layers.MaxPooling2D((2,2))(c3)

    # Bottleneck
    c4 = layers.Conv2D(512, (3,3), activation='relu', padding='same')(p3)
    c4 = layers.Conv2D(512, (3,3), activation='relu', padding='same')(c4)

    # Decoder
    u5 = layers.Conv2DTranspose(256, (2,2), strides=(2,2), padding='same')(c4)
    u5 = layers.concatenate([u5, c3])
    c5 = layers.Conv2D(256, (3,3), activation='relu', padding='same')(u5)
    c5 = layers.Conv2D(256, (3,3), activation='relu', padding='same')(c5)

    u6 = layers.Conv2DTranspose(128, (2,2), strides=(2,2), padding='same')(c5)
    u6 = layers.concatenate([u6, c2])
    c6 = layers.Conv2D(128, (3,3), activation='relu', padding='same')(u6)
    c6 = layers.Conv2D(128, (3,3), activation='relu', padding='same')(c6)

    u7 = layers.Conv2DTranspose(64, (2,2), strides=(2,2), padding='same')(c6)
    u7 = layers.concatenate([u7, c1])
    c7 = layers.Conv2D(64, (3,3), activation='relu', padding='same')(u7)
    c7 = layers.Conv2D(64, (3,3), activation='relu', padding='same')(c7)

    outputs = layers.Conv2D(1, (1,1), activation='sigmoid')(c7)

    model = models.Model(inputs=[inputs], outputs=[outputs])
    return model

# -----------------------------
# Training Script
# -----------------------------
def main(args):
    print("📂 Loading dataset...")
    X_train, Y_train = load_dataset(args.train_images, args.train_masks, img_size=(args.img_size, args.img_size))
    X_val, Y_val = load_dataset(args.val_images, args.val_masks, img_size=(args.img_size, args.img_size))

    print(f"✅ Train: {X_train.shape}, {Y_train.shape}")
    print(f"✅ Val:   {X_val.shape}, {Y_val.shape}")

    print("🧠 Building model...")
    model = unet_model(input_size=(args.img_size, args.img_size, 3))
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

    print("🚀 Training...")
    model.fit(
        X_train, Y_train,
        validation_data=(X_val, Y_val),
        batch_size=args.batch_size,
        epochs=args.epochs
    )

    print("💾 Saving model...")
    model.save("wound_unet_tf.h5")
    print("✅ Model saved: wound_unet_tf.h5")

# -----------------------------
# Main
# -----------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--train_images", type=str, required=True)
    parser.add_argument("--train_masks", type=str, required=True)
    parser.add_argument("--val_images", type=str, required=True)
    parser.add_argument("--val_masks", type=str, required=True)
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch_size", type=int, default=8)
    parser.add_argument("--img_size", type=int, default=128)
    args = parser.parse_args()

    main(args)
