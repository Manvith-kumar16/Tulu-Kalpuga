import os
import sys

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from predict import load_model_and_classes
    print("--- START REPORT ---")
    model, classes = load_model_and_classes()
    print(f"SHAPE: {model.input_shape}")
    print("--- END REPORT ---")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
