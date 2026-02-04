# classifier.py - small script to compare two image files locally
import cv2
from app import binarize_and_clean, compute_iou, compute_normalized_hausdorff, ssim
import numpy as np

def compare_files(template_path, user_path):
    t = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)
    u = cv2.imread(user_path, cv2.IMREAD_GRAYSCALE)
    t_bin = binarize_and_clean(t)
    u_bin = binarize_and_clean(u, target_size=t_bin.shape)
    s = ssim(t_bin, u_bin, data_range=255)
    i = compute_iou(t_bin, u_bin)
    hd = compute_normalized_hausdorff(t_bin, u_bin)
    sim = 0.55*s + 0.30*i + 0.15*(1-hd)
    return {"ssim": s, "iou": i, "hausdorff_norm": hd, "combined": sim}

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("usage: python classifier.py template.png user.png")
        sys.exit(1)
    print(compare_files(sys.argv[1], sys.argv[2]))
