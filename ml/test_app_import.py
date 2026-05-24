import sys
import time

print("Starting app import test...", flush=True)
start = time.time()
try:
    import app
    print(f"App imported successfully in {time.time() - start:.4f}s", flush=True)
except Exception as e:
    print(f"App import failed: {e}", flush=True)
    import traceback
    traceback.print_exc()
