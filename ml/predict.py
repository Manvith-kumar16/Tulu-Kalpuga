# predict.py
import os
import numpy as np
import tensorflow as tf
from utils import load_image_bytes_from_base64, preprocess_pil_image, load_class_names

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.h5")
CLASS_PATH = os.path.join(os.path.dirname(__file__), "class_names.npy")

_model = None
_class_names = None

def load_model_and_classes(model_path=MODEL_PATH, class_path=CLASS_PATH):
    global _model, _class_names
    if _model is None:
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")
        _model = tf.keras.models.load_model(model_path)
    if _class_names is None:
        if not os.path.exists(class_path):
            raise FileNotFoundError(f"Class names file not found: {class_path}")
        _class_names = load_class_names(class_path)
    return _model, _class_names

def predict_from_base64(b64_image: str, top_k=3, target_size=(224,224)):
    model, class_names = load_model_and_classes()
    pil = load_image_bytes_from_base64(b64_image)
    arr = preprocess_pil_image(pil, target_size=target_size)
    x = np.expand_dims(arr, 0)  # (1,H,W,3)
    preds = model.predict(x)[0]
    # get top-k
    idx = np.argsort(preds)[::-1][:top_k]
    results = [{"label": class_names[i], "score": float(preds[i])} for i in idx]
    top_label = results[0]["label"]
    top_score = results[0]["score"]
    return {"predictions": results, "top_label": top_label, "top_score": top_score}
