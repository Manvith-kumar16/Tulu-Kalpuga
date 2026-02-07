import sys
import os

# Add the current directory to sys.path so we can import from predict.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from predict import load_model_and_classes
    print("Attempting to load model...")
    model, classes = load_model_and_classes()
    print("Model loaded successfully!")
    print(f"Classes found: {classes}")
except Exception as e:
    print(f"Failed to load model: {e}")
    sys.exit(1)
