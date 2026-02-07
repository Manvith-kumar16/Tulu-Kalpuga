# predict.py
import os
import numpy as np
import tensorflow as tf
from PIL import Image
from utils import load_image_bytes_from_base64, load_class_names

MODEL_PATH = os.path.join(os.path.dirname(__file__), "tulu_final_model.keras")
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
    
    # Load and preprocess for 64x64 RGB model
    pil = load_image_bytes_from_base64(b64_image)
    pil = pil.convert("RGB")  # Convert to RGB (3 channels)
    pil = pil.resize((64, 64), Image.Resampling.LANCZOS)
    
    arr = np.array(pil, dtype=np.float32)
    arr = arr / 255.0  # Normalize to [0, 1]
    
    # Shape is now (64, 64, 3)
    # Add batch dimension: (1, 64, 64, 3)
    x = np.expand_dims(arr, 0)
    
    preds = model.predict(x)[0]
    # get top-k
    idx = np.argsort(preds)[::-1][:top_k]
    results = [{"label": class_names[i], "score": float(preds[i])} for i in idx]
    top_label = results[0]["label"]
    top_score = results[0]["score"]
    return {"predictions": results, "top_label": top_label, "top_score": top_score}
