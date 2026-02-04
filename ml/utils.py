# utils.py
import base64
import io
from PIL import Image
import numpy as np

def load_image_bytes_from_base64(b64_image: str):
    """
    Load image from base64 string. Handles both plain base64 and data URL format.
    
    Args:
        b64_image: Base64 string, optionally with data URL prefix (data:image/png;base64,...)
    
    Returns:
        PIL Image object
    """
    # Remove data URL prefix if present
    if ',' in b64_image:
        # Split on comma and take the base64 part
        b64_image = b64_image.split(',')[1]
    
    # Decode base64
    try:
        image_bytes = base64.b64decode(b64_image)
    except Exception as e:
        raise ValueError(f"Failed to decode base64 image: {str(e)}")
    
    # Load image from bytes
    try:
        image = Image.open(io.BytesIO(image_bytes))
        # Convert to RGB if necessary (handles RGBA, P, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        return image
    except Exception as e:
        raise ValueError(f"Failed to load image from bytes: {str(e)}")

def preprocess_pil_image(pil_image, target_size=(128, 128)):
    """
    Preprocess PIL image for model input.
    
    Args:
        pil_image: PIL Image object
        target_size: Tuple of (width, height) for resizing
    
    Returns:
        Numpy array of shape (H, W, 3) with values normalized to [0, 1]
    """
    # Resize image
    pil_image = pil_image.resize(target_size, Image.Resampling.LANCZOS)
    
    # Convert to numpy array and normalize to [0, 1]
    # Convert to numpy array and normalize to [-1, 1] for MobileNetV2
    # (x / 127.5) - 1
    arr = np.array(pil_image, dtype=np.float32)
    arr = (arr / 127.5) - 1.0
    
    return arr

def load_class_names(class_path):
    """
    Load class names from .npy file.
    
    Args:
        class_path: Path to .npy file containing class names
    
    Returns:
        List of class names
    """
    try:
        class_names = np.load(class_path, allow_pickle=True)
        # Convert to list if it's a numpy array
        if isinstance(class_names, np.ndarray):
            class_names = class_names.tolist()
        return class_names
    except Exception as e:
        raise ValueError(f"Failed to load class names from {class_path}: {str(e)}")

def get_class_names_from_folder(folder_path):
    """
    Get class names from subdirectories in a folder.
    """
    import os
    if not os.path.exists(folder_path):
        return []
    return sorted([d for d in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, d))])

def save_class_names(class_names, path):
    """
    Save class names to .npy file.
    """
    import numpy as np
    try:
        np.save(path, np.array(class_names))
    except Exception as e:
        print(f"Failed to save class names: {e}")
