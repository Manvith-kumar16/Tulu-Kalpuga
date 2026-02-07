# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from predict import predict_from_base64, load_model_and_classes

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def home():
    return jsonify({"message": "Tulu Kalpuga ML API running 🚀"})

@app.route("/predict", methods=["POST"])
def predict():
    """
    Expects JSON:
    {
      "image": "data:image/png;base64,....",
      "expected": "a"   // optional transliteration / expected label
    }
    """
    data = request.get_json(force=True)
    if not data or "image" not in data:
        return jsonify({"error": "Provide 'image' (base64) in JSON body"}), 400

    b64 = data["image"]
    expected = data.get("expected", None)

    try:
        res = predict_from_base64(b64)
        top_label = res["top_label"]
        top_score = res["top_score"]
        correct = None
        if expected:
            correct = (str(expected).strip() == str(top_label).strip())
        return jsonify({
            "predicted": top_label,
            "score": float(top_score),
            "correct": correct,
            "predictions": res["predictions"]
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# alias endpoint used previously in your frontend
@app.route("/classify", methods=["POST"])
def classify_alias():
    return predict()

if __name__ == "__main__":
    # Optionally try to pre-load model so first request is fast
    try:
        load_model_and_classes()
        print("Model preloaded.")
    except Exception as e:
        print("Model not loaded at start:", e)
        print("Start server and call /predict after training model is created.")
    app.run(host="0.0.0.0", port=5001, debug=True)
