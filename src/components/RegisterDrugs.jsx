import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import CryptoJS from "crypto-js";

const manufacturers = {
  manu123: "securepass",
  pharmaX: "ph@rma456",
  "Renan Hawladar": "9163841820",
  "1": "2",
};

export default function RegisterDrug() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [manufacturerId, setManufacturerId] = useState("");
  const [drugData, setDrugData] = useState({
    drugName: "",
    manufacturerName: "",
    mfgDate: "",
    expiryDate: "",
    batchNumber: "",
    composition: "",
    quantity: "",
  });
  const [qrValue, setQrValue] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredDrugs, setRegisteredDrugs] = useState([]);

  useEffect(() => {
    if (manufacturerId) {
      const allDrugs = JSON.parse(localStorage.getItem("registeredDrugs") || "{}");
      const now = new Date();
      const validDrugs = (allDrugs[manufacturerId] || []).filter(d => new Date(d.expiryDate) >= now);
      allDrugs[manufacturerId] = validDrugs;
      localStorage.setItem("registeredDrugs", JSON.stringify(allDrugs));
      setRegisteredDrugs(validDrugs);
    }
  }, [manufacturerId, success]);

  const handleLogin = () => {
    const id = document.getElementById("manufacturerId").value;
    const pass = document.getElementById("manufacturerPass").value;

    if (manufacturers[id] === pass) {
      setIsLoggedIn(true);
      setError(false);
      setManufacturerId(id);
      setDrugData((prev) => ({ ...prev, manufacturerName: id }));
    } else {
      setError(true);
    }
  };

  const handleChange = (e) => {
    setDrugData({ ...drugData, [e.target.id]: e.target.value });
  };

  const handleRegister = () => {
    const allDrugs = JSON.parse(localStorage.getItem("registeredDrugs") || "{}");
    const manufacturer = drugData.manufacturerName || "unknown";

    const existing = (allDrugs[manufacturer] || []).find(
      (d) => d.drugName === drugData.drugName && d.mfgDate === drugData.mfgDate
    );

    if (existing) {
      alert("Duplicate entry: Same drug name with same manufacturing date already registered.");
      return;
    }

    const uniqueId = CryptoJS.SHA256(`${drugData.drugName}-${Date.now()}`).toString();
    const timestamp = new Date().toISOString();

    const newDrug = {
      id: uniqueId,
      ...drugData,
      quantity: parseInt(drugData.quantity),
      timestamp,
    };

    if (!allDrugs[manufacturer]) allDrugs[manufacturer] = [];
    allDrugs[manufacturer].push(newDrug);
    localStorage.setItem("registeredDrugs", JSON.stringify(allDrugs));
    setRegisteredDrugs(allDrugs[manufacturer]);

    const url = `https://yourdomain.com/verify/${uniqueId}`;
    setQrValue(url);
    setShowQR(true);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 3000);
    setDrugData({
      drugName: "",
      manufacturerName: manufacturer,
      mfgDate: "",
      expiryDate: "",
      batchNumber: "",
      composition: "",
      quantity: "",
    });
  };

  const downloadQR = () => {
    const canvas = document.querySelector("#qrcode canvas");
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "drug_qr.png";
    link.href = pngUrl;
    link.click();
  };

  const getStatus = (quantity) => {
    if (quantity <= 0) return ["Out of Stock", "red"];
    if (quantity <= 2) return ["Low Stock", "orange"];
    return ["In Stock", "green"];
  };

  return (
    <main className="section">
      {!isLoggedIn ? (
        <div className="form-container" id="loginForm">
          <h2>Manufacturer Login</h2>
          <input type="text" id="manufacturerId" placeholder="Enter Manufacturer ID" required />
          <input type="password" id="manufacturerPass" placeholder="Enter Password" required />
          <button onClick={handleLogin}>Login</button>
          {error && <div className="error-msg">Invalid credentials. Try again.</div>}
        </div>
      ) : (
        <div className="form-container" id="registerDrugForm">
          <h2>Register New Drug</h2>
          <input type="text" id="drugName" value={drugData.drugName} onChange={handleChange} placeholder="Drug Name" required />
          <input type="text" id="manufacturerName" value={drugData.manufacturerName} readOnly />

          <div className="form-group">
            <label htmlFor="mfgDate">Manufacture Date</label>
            <input type="date" id="mfgDate" value={drugData.mfgDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input type="date" id="expiryDate" value={drugData.expiryDate} onChange={handleChange} required />
          </div>

          <input type="text" id="batchNumber" value={drugData.batchNumber} onChange={handleChange} placeholder="Batch Number" required />
          <textarea id="composition" value={drugData.composition} onChange={handleChange} placeholder="Enter Composition" rows="4" required></textarea>
          <input type="number" id="quantity" value={drugData.quantity} onChange={handleChange} placeholder="Quantity" required />

          <button onClick={handleRegister}>Register Drug</button>

          {showQR && (
            <div id="qrContainer" style={{ marginTop: "20px" }}>
              <h3>Generated QR Code</h3>
              <div id="qrcode">
                <QRCodeCanvas value={qrValue} size={180} />
              </div>
              <button onClick={downloadQR}>Download QR</button>
            </div>
          )}

          {success && <div className="success-msg">✅ Drug registered successfully!</div>}

          <div className="inventory-section" style={{ marginTop: "50px" }}>
            <div className="header">
              <h2>Registered Drugs Dashboard</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Batch</th>
                  <th>Manufactured</th>
                  <th>Expiry</th>
                  <th>Composition</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Controls</th>
                  <th>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {registeredDrugs.length > 0 ? (
                  registeredDrugs.map((drug, index) => {
                    const [status, color] = getStatus(drug.quantity);
                    return (
                      <tr key={index}>
                        <td>{drug.drugName}</td>
                        <td>{drug.batchNumber}</td>
                        <td>{drug.mfgDate}</td>
                        <td>{drug.expiryDate}</td>
                        <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{drug.composition}</td>
                        <td>{drug.quantity}</td>
                        <td style={{ color }}>{status}</td>
                        <td>
                          <button onClick={() => {
                            const updated = [...registeredDrugs];
                            updated[index].quantity = Math.max(0, updated[index].quantity - 1);
                            const all = JSON.parse(localStorage.getItem("registeredDrugs") || "{}");
                            all[manufacturerId] = updated;
                            localStorage.setItem("registeredDrugs", JSON.stringify(all));
                            setRegisteredDrugs(updated);
                          }}>−</button>
                        </td>
                        <td>{new Date(drug.timestamp).toLocaleString()}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9">No drugs registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

