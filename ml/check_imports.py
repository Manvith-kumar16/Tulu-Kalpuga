import sys
import time
print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")

print("Attempting to import ssl...", flush=True)
start = time.time()
try:
    import ssl
    print(f"SSL imported successfully in {time.time() - start:.4f}s", flush=True)
except Exception as e:
    print(f"SSL import failed: {e}", flush=True)

print("Attempting to import flask...", flush=True)
start = time.time()
try:
    import flask
    print(f"Flask imported successfully in {time.time() - start:.4f}s", flush=True)
except Exception as e:
    print(f"Flask import failed: {e}", flush=True)
