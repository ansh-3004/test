import { useState } from "react";
import jsQR from "jsqr";

export default function Authenticator() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          verifyDrug(code.data);
        } else {
          setError("QR code not detected. Try another image.");
          setResult(null);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const verifyDrug = (hash) => {
    const allDrugs = JSON.parse(localStorage.getItem("registeredDrugs") || "{}");
    for (const manufacturer in allDrugs) {
      const match = allDrugs[manufacturer].find((drug) => {
        const expected = `https://yourdomain.com/verify/${drug.id}`;
        return expected === hash;
      });
      if (match) {
        setResult(match);
        setError("");
        return;
      }
    }
    setResult(null);
    setError("⚠️ This is a counterfeit drug. Not found in the registry.");
  };

  return (
    <main className="section" style={{ textAlign: "center", padding: "40px" }}>
      <div className="form-container">
        <h2>Drug Authenticator</h2>
        <p style={{ color: "#ccc", marginBottom: "15px" }}>
          Upload a QR Code image to authenticate a drug
        </p>

        <label
          htmlFor="qrInput"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#004d40",
            color: "#fff",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            marginBottom: "20px",
          }}
        >
          📤 Upload QR to Authenticate
          <input
            type="file"
            id="qrInput"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </label>

        {error && (
          <div
            className="error-msg"
            style={{
              color: "orange",
              marginTop: "20px",
              fontWeight: "500",
              fontSize: "16px",
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            className="result-card"
            style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#004d40",
              color: "#fff",
              maxWidth: "600px",
              margin: "30px auto",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
              textAlign: "left",
              wordBreak: "break-word",
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#FE9677" }}>
              ✅ Verified Drug Details
            </h3>
            <p><strong>Name:</strong> {result.drugName}</p>
            <p><strong>Manufacturer:</strong> {result.manufacturerName}</p>
            <p><strong>Batch:</strong> {result.batchNumber}</p>
            <p><strong>Manufacture Date:</strong> {result.mfgDate}</p>
            <p><strong>Expiry Date:</strong> {result.expiryDate}</p>
            <p><strong>Composition:</strong><br />{result.composition}</p>
            {/* <p><strong>Quantity:</strong> {result.quantity}</p> */}
            <p><strong>Registered On:</strong> {new Date(result.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>
    </main>
  );
}

