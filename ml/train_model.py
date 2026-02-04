# train_model.py
import os
import argparse
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
from utils import get_class_names_from_folder, save_class_names

def build_model(input_shape=(128,128,3), n_classes=50):
    # Use MobileNetV2 for better performance with fewer epochs
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False # Freeze base model initially

    x = base_model.output
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.2)(x)
    out = layers.Dense(n_classes, activation="softmax")(x)

    model = models.Model(base_model.input, out)
    return model

def train(dataset_dir, model_out="model.h5", class_names_out="class_names.npy",
          img_size=(128,128), batch_size=32, epochs=25, lr=1e-3):
    train_dir = os.path.join(dataset_dir, "train")
    valid_dir = os.path.join(dataset_dir, "valid")

    # Data augmentation
    train_gen = ImageDataGenerator(
        preprocessing_function=tf.keras.applications.mobilenet_v2.preprocess_input,
        rotation_range=12,
        width_shift_range=0.12,
        height_shift_range=0.12,
        shear_range=0.08,
        zoom_range=0.12,
        horizontal_flip=False,
        fill_mode="nearest"
    )

    valid_gen = ImageDataGenerator(preprocessing_function=tf.keras.applications.mobilenet_v2.preprocess_input)

    train_flow = train_gen.flow_from_directory(
        train_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode="categorical",
        shuffle=True
    )

    valid_flow = valid_gen.flow_from_directory(
        valid_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode="categorical",
        shuffle=False
    )

    class_indices = train_flow.class_indices
    class_names = [None] * len(class_indices)
    for k, v in class_indices.items():
        class_names[v] = k

    # build model
    model = build_model(input_shape=(*img_size, 3), n_classes=len(class_names))
    model.compile(optimizer=optimizers.Adam(lr),
                  loss="categorical_crossentropy",
                  metrics=["accuracy"])

    # callbacks
    cb = [
        callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, verbose=1),
        callbacks.EarlyStopping(monitor="val_loss", patience=7, restore_best_weights=True),
        callbacks.ModelCheckpoint(model_out, save_best_only=True, monitor="val_loss", verbose=1)
    ]

    steps_per_epoch = train_flow.samples // batch_size
    validation_steps = max(1, valid_flow.samples // batch_size)

    model.fit(
        train_flow,
        epochs=epochs,
        steps_per_epoch=steps_per_epoch,
        validation_data=valid_flow,
        validation_steps=validation_steps,
        callbacks=cb
    )

    # save final model and class_names
    model.save(model_out)
    save_class_names(class_names, class_names_out)
    print("Training done. Model saved to", model_out)
    print("Classes saved to", class_names_out)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset_dir", required=True, help="Path to Dataset1 folder (contains train/ valid/ test/)")
    parser.add_argument("--out_model", default="model.h5")
    parser.add_argument("--out_classes", default="class_names.npy")
    parser.add_argument("--img_size", type=int, default=128)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--epochs", type=int, default=25)
    args = parser.parse_args()

    train(args.dataset_dir, model_out=args.out_model, class_names_out=args.out_classes,
          img_size=(args.img_size, args.img_size), batch_size=args.batch_size, epochs=args.epochs)
# train_model.py
import os
import argparse
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
from utils import get_class_names_from_folder, save_class_names

def build_model(input_shape=(128,128,3), n_classes=50):
    # Simple CNN — works well for prototyping. Replace with ResNet/MobileNet if needed.
    inp = layers.Input(shape=input_shape)
    x = layers.Conv2D(32, 3, activation="relu", padding="same")(inp)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPool2D()(x)

    x = layers.Conv2D(64, 3, activation="relu", padding="same")(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPool2D()(x)

    x = layers.Conv2D(128, 3, activation="relu", padding="same")(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPool2D()(x)

    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.BatchNormalization()(x)
    out = layers.Dense(n_classes, activation="softmax")(x)

    model = models.Model(inp, out)
    return model

def train(dataset_dir, model_out="model.h5", class_names_out="class_names.npy",
          img_size=(128,128), batch_size=32, epochs=25, lr=1e-3):
    train_dir = os.path.join(dataset_dir, "train")
    valid_dir = os.path.join(dataset_dir, "valid")

    # Data augmentation
    train_gen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=12,
        width_shift_range=0.12,
        height_shift_range=0.12,
        shear_range=0.08,
        zoom_range=0.12,
        horizontal_flip=False,
        fill_mode="nearest"
    )

    valid_gen = ImageDataGenerator(rescale=1./255)

    train_flow = train_gen.flow_from_directory(
        train_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode="categorical",
        shuffle=True
    )

    valid_flow = valid_gen.flow_from_directory(
        valid_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode="categorical",
        shuffle=False
    )

    class_indices = train_flow.class_indices
    class_names = [None] * len(class_indices)
    for k, v in class_indices.items():
        class_names[v] = k

    # build model
    model = build_model(input_shape=(*img_size, 3), n_classes=len(class_names))
    model.compile(optimizer=optimizers.Adam(lr),
                  loss="categorical_crossentropy",
                  metrics=["accuracy"])

    # callbacks
    cb = [
        callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, verbose=1),
        callbacks.EarlyStopping(monitor="val_loss", patience=7, restore_best_weights=True),
        callbacks.ModelCheckpoint(model_out, save_best_only=True, monitor="val_loss", verbose=1)
    ]

    steps_per_epoch = train_flow.samples // batch_size
    validation_steps = max(1, valid_flow.samples // batch_size)

    model.fit(
        train_flow,
        epochs=epochs,
        steps_per_epoch=steps_per_epoch,
        validation_data=valid_flow,
        validation_steps=validation_steps,
        callbacks=cb
    )

    # save final model and class_names
    model.save(model_out)
    save_class_names(class_names, class_names_out)
    print("Training done. Model saved to", model_out)
    print("Classes saved to", class_names_out)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset_dir", required=True, help="Path to Dataset1 folder (contains train/ valid/ test/)")
    parser.add_argument("--out_model", default="model.h5")
    parser.add_argument("--out_classes", default="class_names.npy")
    parser.add_argument("--img_size", type=int, default=128)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--epochs", type=int, default=25)
    args = parser.parse_args()

    train(args.dataset_dir, model_out=args.out_model, class_names_out=args.out_classes,
          img_size=(args.img_size, args.img_size), batch_size=args.batch_size, epochs=args.epochs)
