import numpy as np
import os

try:
    class_names = np.load('class_names.npy')
    print("Class Names:", class_names)
    for name in class_names:
        print(f"'{name}'")
except Exception as e:
    print(f"Error loading class names: {e}")
