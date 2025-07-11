// import { useEffect, useState } from "react";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import Chart from "chart.js/auto";

// const SAMPLE_INVENTORIES = {
//   "HyderabadStore-1": {
//     name: "Hyderabad Store",
//     location: "Hyderabad",
//     password: "hydpass",
//     drugs: [
//       { name: "Paracetamol", batch: "H123", expiry: "2025-12-01", stock: 30 },
//       { name: "Amoxicillin", batch: "H124", expiry: "2024-11-01", stock: 8 },
//       { name: "Ibuprofen", batch: "H125", expiry: "2026-06-01", stock: 0 },
//       { name: "Cetrizine", batch: "H126", expiry: "2025-09-01", stock: 15 },
//       { name: "Azithromycin", batch: "H127", expiry: "2024-08-01", stock: 3 },
//     ],
//   },
//   "MumbaiClinic-2": {
//     name: "Mumbai Clinic",
//     location: "Mumbai",
//     password: "mumbaipass",
//     drugs: [
//       { name: "Dolo 650", batch: "M111", expiry: "2026-01-01", stock: 45 },
//       { name: "Ranitidine", batch: "M112", expiry: "2024-10-01", stock: 5 },
//       { name: "Metformin", batch: "M113", expiry: "2025-07-01", stock: 9 },
//       { name: "Amoxicillin", batch: "M114", expiry: "2026-12-01", stock: 0 },
//       { name: "Amlodipine", batch: "M115", expiry: "2025-03-01", stock: 18 },
//       { name: "Losartan", batch: "M116", expiry: "2025-09-01", stock: 7 },
//     ],
//   },
//   "DelhiPharma-3": {
//     name: "Delhi Pharma Depot",
//     location: "Delhi",
//     password: "delhipass",
//     drugs: [
//       { name: "Levocetirizine", batch: "D211", expiry: "2024-12-01", stock: 25 },
//       { name: "Cough Syrup", batch: "D212", expiry: "2023-09-01", stock: 0 },
//       { name: "Vitamin C", batch: "D213", expiry: "2026-02-01", stock: 20 },
//       { name: "Pantoprazole", batch: "D214", expiry: "2025-10-01", stock: 3 },
//       { name: "Dexamethasone", batch: "D215", expiry: "2025-05-01", stock: 6 },
//     ],
//   },
//   "BangaloreMediMart-4": {
//     name: "Bangalore MediMart",
//     location: "Bangalore",
//     password: "blorepass",
//     drugs: [
//       { name: "Amoxiclav", batch: "B311", expiry: "2026-06-01", stock: 12 },
//       { name: "Paracetamol", batch: "B312", expiry: "2025-04-01", stock: 22 },
//       { name: "Ibuprofen", batch: "B313", expiry: "2024-11-01", stock: 2 },
//       { name: "Zincovit", batch: "B314", expiry: "2025-12-01", stock: 40 },
//       { name: "ORS Sachets", batch: "B315", expiry: "2025-07-15", stock: 10 },
//     ],
//   },
// };

// export default function Inventory() {
//   const [stores, setStores] = useState({});
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [trendChartInstance, setTrendChartInstance] = useState(null);
//   const [storeName, setStoreName] = useState("");
//   const [location, setLocation] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");

//   useEffect(() => {
//     const stored = localStorage.getItem("inventories");
//     if (stored) {
//       setStores(JSON.parse(stored));
//     } else {
//       localStorage.setItem("inventories", JSON.stringify(SAMPLE_INVENTORIES));
//       setStores(SAMPLE_INVENTORIES);
//     }
//   }, []);

//   const updateLocalStorage = (updated) => {
//     setStores(updated);
//     localStorage.setItem("inventories", JSON.stringify(updated));
//   };

//   const handleRegisterInventory = (e) => {
//     e.preventDefault();
//     const id = `${storeName.replace(/\s+/g, "")}-${Object.keys(stores).length + 1}`;
//     const newStore = {
//       name: storeName,
//       location,
//       password: adminPassword,
//       drugs: [],
//     };
//     const updatedStores = { ...stores, [id]: newStore };
//     updateLocalStorage(updatedStores);
//     setStoreName("");
//     setLocation("");
//     setAdminPassword("");
//   };

//   const getStatus = (stock) => {
//     if (stock <= 0) return ["Out of Stock", "red"];
//     if (stock <= 2) return ["Low Stock", "orange"];
//     return ["In Stock", "green"];
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value.toLowerCase());
//   };

//   const exportCSV = () => {
//     const rows = [["Name", "Batch", "Expiry", "Stock", "Status"]];
//     stores[selectedStore].drugs.forEach((d) => {
//       const [status] = getStatus(d.stock);
//       rows.push([d.name, d.batch, d.expiry, d.stock, status]);
//     });
//     const csv = rows.map((r) => r.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "inventory.csv";
//     a.click();
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Hackivate Drug Inventory", 14, 20);
//     const rows = stores[selectedStore].drugs.map((d) => {
//       const [status] = getStatus(d.stock);
//       return [d.name, d.batch, d.expiry, d.stock, status];
//     });
//     doc.autoTable({
//       startY: 30,
//       head: [["Name", "Batch", "Expiry", "Stock", "Status"]],
//       body: rows,
//     });
//     doc.save("inventory.pdf");
//   };

//   const updateStock = (storeId, index, change) => {
//     const updated = { ...stores };
//     updated[storeId].drugs[index].stock += change;
//     if (updated[storeId].drugs[index].stock < 0)
//       updated[storeId].drugs[index].stock = 0;
//     updateLocalStorage(updated);
//   };

//   const showTrend = (drug) => {
//     const key = `${selectedStore}_${drug.name}_${drug.batch}`;
//     const trends = JSON.parse(localStorage.getItem("drugTrends") || "{}")[key] || [];

//     const ctx = document.getElementById("trendChart").getContext("2d");
//     if (trendChartInstance) trendChartInstance.destroy();
//     const chart = new Chart(ctx, {
//       type: "line",
//       data: {
//         labels: trends.map((t) => t.date),
//         datasets: [{
//           label: `${drug.name} Stock`,
//           data: trends.map((t) => t.stock),
//           borderColor: "#00796b",
//           backgroundColor: "rgba(0,150,136,0.2)",
//         }],
//       },
//       options: {
//         responsive: true,
//         plugins: { legend: { display: false } },
//         scales: { y: { beginAtZero: true } },
//       },
//     });
//     setTrendChartInstance(chart);
//     document.getElementById("trendModal").classList.remove("hidden");
//   };

//   const closeTrendModal = () => {
//     document.getElementById("trendModal").classList.add("hidden");
//   };

//   return (
//     <section className="section">
//       {!selectedStore ? (
//         <div className="inventory-browser">
//           <h2>Register New Inventory</h2>
//           <form onSubmit={handleRegisterInventory} className="inventory-form">
//             <input
//               type="text"
//               placeholder="Store Name"
//               value={storeName}
//               onChange={(e) => setStoreName(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Admin Password"
//               value={adminPassword}
//               onChange={(e) => setAdminPassword(e.target.value)}
//               required
//             />
//             <button type="submit">Register Inventory</button>
//           </form>

//           <h2>Available Inventories</h2>
//           <input
//             type="text"
//             placeholder="Search store..."
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <ul id="storeList">
//             {Object.entries(stores)
//               .filter(([_, s]) =>
//                 s.name.toLowerCase().includes(searchTerm)
//               )
//               .map(([id, store]) => (
//                 <li key={id} onClick={() => setSelectedStore(id)}>
//                   {store.name} ({store.location})
//                 </li>
//               ))}
//           </ul>
//         </div>
//       ) : (
//         <div className="inventory-section">
//           <div className="header">
//             <h1>{stores[selectedStore].name} Inventory</h1>
//             <div>
//               <button onClick={exportCSV}>Export CSV</button>
//               <button onClick={exportPDF}>Export PDF</button>
//               <button onClick={() => setSelectedStore(null)}>← Back</button>
//             </div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Batch</th>
//                 <th>Expiry</th>
//                 <th>Stock</th>
//                 <th>Status</th>
//                 <th>Controls</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stores[selectedStore].drugs.map((drug, i) => {
//                 const [status, color] = getStatus(drug.stock);
//                 const key = `${selectedStore}_${drug.name}_${drug.batch}`;
//                 const trends = JSON.parse(localStorage.getItem("drugTrends") || "{}");
//                 if (!trends[key]) trends[key] = [];

//                 const today = new Date().toISOString().split("T")[0];
//                 if (!trends[key].some((t) => t.date === today)) {
//                   trends[key].push({ date: today, stock: drug.stock });
//                   localStorage.setItem("drugTrends", JSON.stringify(trends));
//                 }

//                 return (
//                   <tr key={i}>
//                     <td>{drug.name}</td>
//                     <td>{drug.batch}</td>
//                     <td>{drug.expiry}</td>
//                     <td>{drug.stock}</td>
//                     <td style={{ color }}>{status}</td>
//                     <td className="actions-btns">
//                       <button onClick={() => updateStock(selectedStore, i, 1)}>+</button>
//                       <button onClick={() => updateStock(selectedStore, i, -1)}>−</button>
//                       <button className="trend-btn" onClick={() => showTrend(drug)}>📈 View Trends</button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           <div id="trendModal" className="modal hidden">
//             <div className="modal-content">
//               <span className="close" onClick={closeTrendModal}>&times;</span>
//               <canvas id="trendChart" width="600" height="300"></canvas>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// import { useEffect, useState } from "react";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import Chart from "chart.js/auto";

// const SAMPLE_INVENTORIES = {
//   "HyderabadStore-1": {
//     name: "Hyderabad Store",
//     location: "Hyderabad",
//     adminPassword: "hyd@123",
//     drugs: [
//       { name: "Paracetamol", batch: "H123", expiry: "2025-12-01", stock: 30 },
//       { name: "Amoxicillin", batch: "H124", expiry: "2024-11-01", stock: 8 },
//       { name: "Ibuprofen", batch: "H125", expiry: "2026-06-01", stock: 0 },
//       { name: "Cetrizine", batch: "H126", expiry: "2025-09-01", stock: 15 },
//       { name: "Azithromycin", batch: "H127", expiry: "2024-08-01", stock: 3 },
//     ],
//   },
//   "MumbaiClinic-2": {
//     name: "Mumbai Clinic",
//     location: "Mumbai",
//     adminPassword: "mumbai456",
//     drugs: [
//       { name: "Dolo 650", batch: "M111", expiry: "2026-01-01", stock: 45 },
//       { name: "Ranitidine", batch: "M112", expiry: "2024-10-01", stock: 5 },
//       { name: "Metformin", batch: "M113", expiry: "2025-07-01", stock: 9 },
//       { name: "Amoxicillin", batch: "M114", expiry: "2026-12-01", stock: 0 },
//       { name: "Amlodipine", batch: "M115", expiry: "2025-03-01", stock: 18 },
//       { name: "Losartan", batch: "M116", expiry: "2025-09-01", stock: 7 },
//     ],
//   },
// };

// export default function Inventory() {
//   const [stores, setStores] = useState({});
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [accessGranted, setAccessGranted] = useState(false);
//   const [adminInput, setAdminInput] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [toast, setToast] = useState("");
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [deletingStore, setDeletingStore] = useState(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("inventories");
//     if (stored) {
//       setStores(JSON.parse(stored));
//     } else {
//       localStorage.setItem("inventories", JSON.stringify(SAMPLE_INVENTORIES));
//       setStores(SAMPLE_INVENTORIES);
//     }
//   }, []);

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(""), 3000);
//   };

//   const updateLocalStorage = (updated) => {
//     setStores(updated);
//     localStorage.setItem("inventories", JSON.stringify(updated));
//   };

//   const updateStock = (storeId, index, change) => {
//     const updated = { ...stores };
//     updated[storeId].drugs[index].stock += change;
//     if (updated[storeId].drugs[index].stock < 0)
//       updated[storeId].drugs[index].stock = 0;
//     updateLocalStorage(updated);
//   };

//   const getStatus = (stock) => {
//     if (stock <= 0) return ["Out of Stock", "red"];
//     if (stock <= 2) return ["Low Stock", "orange"];
//     return ["In Stock", "green"];
//   };

//   const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

//   const exportCSV = () => {
//     const rows = [["Name", "Batch", "Expiry", "Stock", "Status"]];
//     stores[selectedStore].drugs.forEach((d) => {
//       const [status] = getStatus(d.stock);
//       rows.push([d.name, d.batch, d.expiry, d.stock, status]);
//     });
//     const csv = rows.map((r) => r.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "inventory.csv";
//     a.click();
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Hackivate Drug Inventory", 14, 20);
//     const rows = stores[selectedStore].drugs.map((d) => {
//       const [status] = getStatus(d.stock);
//       return [d.name, d.batch, d.expiry, d.stock, status];
//     });
//     doc.autoTable({
//       startY: 30,
//       head: [["Name", "Batch", "Expiry", "Stock", "Status"]],
//       body: rows,
//     });
//     doc.save("inventory.pdf");
//   };

//   const handleRegisterInventory = () => {
//     const name = document.getElementById("newStoreName").value;
//     const location = document.getElementById("newStoreLocation").value;
//     const password = document.getElementById("newStorePassword").value;

//     if (!name || !location || !password) {
//       showToast("⚠️ Please fill all fields");
//       return;
//     }

//     const id = `${name.replace(/\s+/g, "")}-${Date.now()}`;
//     const newStore = {
//       name,
//       location,
//       adminPassword: password,
//       drugs: [],
//     };

//     const updated = { ...stores, [id]: newStore };
//     updateLocalStorage(updated);
//     showToast("✅ Inventory registered");
//     document.getElementById("newStoreName").value = "";
//     document.getElementById("newStoreLocation").value = "";
//     document.getElementById("newStorePassword").value = "";
//   };

//   const handleAccess = () => {
//     if (adminInput === stores[selectedStore].adminPassword) {
//       setAccessGranted(true);
//       showToast("✅ Access granted");
//     } else {
//       showToast("❌ Wrong password");
//     }
//     setAdminInput("");
//   };

//   const confirmDelete = () => {
//     if (adminInput === stores[deletingStore].adminPassword) {
//       const updated = { ...stores };
//       delete updated[deletingStore];
//       updateLocalStorage(updated);
//       setSelectedStore(null);
//       showToast("🗑️ Inventory deleted");
//     } else {
//       showToast("❌ Incorrect password for deletion");
//     }
//     setShowPasswordModal(false);
//     setAdminInput("");
//     setDeletingStore(null);
//   };

//   return (
//     <section className="section">
//       <div className="register-form">
//         <h2>Register New Inventory</h2>
//         <input id="newStoreName" type="text" placeholder="Store Name" required />
//         <input id="newStoreLocation" type="text" placeholder="Location" required />
//         <input id="newStorePassword" type="password" placeholder="Admin Password" required />
//         <button onClick={handleRegisterInventory}>Register Inventory</button>
//       </div>

//       {!selectedStore ? (
//         <div className="inventory-browser">
//           <h2>Available Inventories</h2>
//           <input
//             type="text"
//             placeholder="Search store..."
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <ul>
//             {Object.entries(stores)
//               .filter(([_, s]) => s.name.toLowerCase().includes(searchTerm))
//               .map(([id, store]) => (
//                 <li key={id} onClick={() => setSelectedStore(id)}>
//                   {store.name} ({store.location})
//                 </li>
//               ))}
//           </ul>
//         </div>
//       ) : !accessGranted ? (
//         <div className="password-prompt">
//           <h3>{stores[selectedStore].name}</h3>
//           <input
//             type="password"
//             placeholder="Enter Admin Password"
//             value={adminInput}
//             onChange={(e) => setAdminInput(e.target.value)}
//           />
//           <button onClick={handleAccess}>Access Inventory</button>
//           <button onClick={() => {
//             setShowPasswordModal(true);
//             setDeletingStore(selectedStore);
//           }}>🗑️ Delete Inventory</button>
//           <button onClick={() => setSelectedStore(null)}>← Back</button>
//         </div>
//       ) : (
//         <div className="inventory-section">
//           <div className="header">
//             <h1>{stores[selectedStore].name} Inventory</h1>
//             <div>
//               <button onClick={exportCSV}>Export CSV</button>
//               <button onClick={exportPDF}>Export PDF</button>
//               <button onClick={() => setSelectedStore(null)}>← Back</button>
//             </div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Batch</th>
//                 <th>Expiry</th>
//                 <th>Stock</th>
//                 <th>Status</th>
//                 <th>Controls</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stores[selectedStore].drugs.map((drug, i) => {
//                 const [status, color] = getStatus(drug.stock);
//                 return (
//                   <tr key={i}>
//                     <td>{drug.name}</td>
//                     <td>{drug.batch}</td>
//                     <td>{drug.expiry}</td>
//                     <td>{drug.stock}</td>
//                     <td style={{ color }}>{status}</td>
//                     <td>
//                       <button onClick={() => updateStock(selectedStore, i, 1)}>+</button>
//                       <button onClick={() => updateStock(selectedStore, i, -1)}>−</button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Password Modal */}
//       {showPasswordModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Enter Admin Password to Confirm Deletion</h3>
//             <input
//               type="password"
//               value={adminInput}
//               onChange={(e) => setAdminInput(e.target.value)}
//               placeholder="Admin Password"
//             />
//             <button onClick={confirmDelete}>Confirm Delete</button>
//             <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
//           </div>
//         </div>
//       )}

//       {toast && <div className="toast">{toast}</div>}
//     </section>
//   );
// }


import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Chart from "chart.js/auto";
import TrendModal from "./TrendModal";

const SAMPLE_INVENTORIES = {
  "HyderabadStore-1": {
    name: "Hyderabad Store",
    location: "Hyderabad",
    adminPassword: "hyd@123",
    drugs: [
      { name: "Paracetamol", batch: "H123", expiry: "2025-12-01", stock: 30 },
      { name: "Amoxicillin", batch: "H124", expiry: "2024-11-01", stock: 8 },
    ],
  },
  "MumbaiClinic-2": {
    name: "Mumbai Clinic",
    location: "Mumbai",
    adminPassword: "mumbai456",
    drugs: [
      { name: "Dolo 650", batch: "M111", expiry: "2026-01-01", stock: 45 },
      { name: "Ranitidine", batch: "M112", expiry: "2024-10-01", stock: 5 },
    ],
  },
};

export default function Inventory() {
  const [stores, setStores] = useState({});
  const [selectedStore, setSelectedStore] = useState(null);
  const [accessGranted, setAccessGranted] = useState({});
  const [adminInput, setAdminInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deletingStore, setDeletingStore] = useState(null);
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [trendDrug, setTrendDrug] = useState(null);
  const chartRef = useRef(null);

  const [addDrugData, setAddDrugData] = useState({
    name: "", batch: "", expiry: "", quantity: ""
  });
  const [addDrugError, setAddDrugError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("inventories");
    if (stored) {
      setStores(JSON.parse(stored));
    } else {
      localStorage.setItem("inventories", JSON.stringify(SAMPLE_INVENTORIES));
      setStores(SAMPLE_INVENTORIES);
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const updateLocalStorage = (updated) => {
    setStores(updated);
    localStorage.setItem("inventories", JSON.stringify(updated));
  };

  const handleRegisterInventory = () => {
    const name = document.getElementById("newStoreName").value;
    const location = document.getElementById("newStoreLocation").value;
    const password = document.getElementById("newStorePassword").value;

    if (!name || !location || !password) {
      showToast("⚠️ Please fill all fields");
      return;
    }

    const id = `${name.replace(/\s+/g, "")}-${Date.now()}`;
    const newStore = {
      name,
      location,
      adminPassword: password,
      drugs: [],
    };

    const updated = { ...stores, [id]: newStore };
    updateLocalStorage(updated);
    showToast("✅ Inventory registered");
    document.getElementById("newStoreName").value = "";
    document.getElementById("newStoreLocation").value = "";
    document.getElementById("newStorePassword").value = "";
  };

  const handleAccess = () => {
    if (adminInput === stores[selectedStore].adminPassword) {
      setAccessGranted({ ...accessGranted, [selectedStore]: true });
      showToast("✅ Access granted");
    } else {
      showToast("❌ Wrong password");
    }
    setAdminInput("");
  };

  const confirmDelete = () => {
    if (adminInput === stores[deletingStore].adminPassword) {
      const updated = { ...stores };
      delete updated[deletingStore];
      updateLocalStorage(updated);
      setSelectedStore(null);
      showToast("🗑️ Inventory deleted");
    } else {
      showToast("❌ Incorrect password for deletion");
    }
    setShowPasswordModal(false);
    setAdminInput("");
    setDeletingStore(null);
  };

  const handleAddDrugChange = (e) => {
    setAddDrugData({ ...addDrugData, [e.target.name]: e.target.value });
  };

  const handleAddDrug = () => {
    const { name, batch, expiry, quantity } = addDrugData;
    if (!name || !batch || !expiry || !quantity) {
      setAddDrugError("⚠️ Fill all fields");
      return;
    }

    const allRegs = JSON.parse(localStorage.getItem("registeredDrugs") || "{}");
    let matched = null;
    for (let manu in allRegs) {
      const found = allRegs[manu].find(d =>
        d.drugName === name &&
        d.batchNumber === batch &&
        d.expiryDate === expiry
      );
      if (found) {
        matched = { ...found, manufacturer: manu };
        break;
      }
    }

    if (!matched) {
      setAddDrugError("❌ No matching registered drug found");
      return;
    }

    const updated = { ...stores };
    const drugList = updated[selectedStore].drugs;

    if (drugList.some(d => d.name === name && d.batch === batch && d.expiry === expiry)) {
      setAddDrugError("⚠️ Drug already exists in inventory");
      return;
    }

    drugList.push({
      name, batch, expiry, stock: parseInt(quantity),
      manufacturer: matched.manufacturer,
      regId: matched.id,
    });
    updateLocalStorage(updated);
    showToast("✅ Drug added");
    setAddDrugData({ name: "", batch: "", expiry: "", quantity: "" });
    setAddDrugError("");
  };

  // const updateStock = (storeId, index, change) => {
  //   const updated = { ...stores };
  //   updated[storeId].drugs[index].stock += change;
  //   if (updated[storeId].drugs[index].stock < 0) updated[storeId].drugs[index].stock = 0;
  //   updateLocalStorage(updated);
  // };

  const updateStock = (storeId, index, change) => {
    const updated = { ...stores };
    const drug = updated[storeId].drugs[index];
    drug.stock += change;
    if (drug.stock < 0) drug.stock = 0;

    // Track trend
    const historyKey = `trend-${storeId}-${drug.name}-${drug.batch}-${drug.expiry}`;
    const prev = JSON.parse(localStorage.getItem(historyKey) || "[]");
    const newEntry = { timestamp: new Date().toISOString(), stock: drug.stock };
    const trimmed = [...prev.slice(-29), newEntry];
    localStorage.setItem(historyKey, JSON.stringify(trimmed));

    updateLocalStorage(updated);
  };


  const getStatus = (stock) => {
    if (stock <= 0) return ["Out of Stock", "red"];
    if (stock <= 2) return ["Low Stock", "orange"];
    return ["In Stock", "green"];
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const exportCSV = () => {
    const rows = [["Name", "Batch", "Expiry", "Stock", "Status"]];
    stores[selectedStore].drugs.forEach((d) => {
      const [status] = getStatus(d.stock);
      rows.push([d.name, d.batch, d.expiry, d.stock, status]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "inventory.csv";
    a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Hackivate Drug Inventory", 14, 20);
    const rows = stores[selectedStore].drugs.map((d) => {
      const [status] = getStatus(d.stock);
      return [d.name, d.batch, d.expiry, d.stock, status];
    });
    doc.autoTable({
      startY: 30,
      head: [["Name", "Batch", "Expiry", "Stock", "Status"]],
      body: rows,
    });
    doc.save("inventory.pdf");
  };

  const showTrend = (drug) => {
    setTrendDrug(drug);
    setShowTrendModal(true);
  };

  return (
    <section className="section">
      <div className="register-form">
        <h2>Register New Inventory</h2>
        <input id="newStoreName" type="text" placeholder="Store Name" required />
        <input id="newStoreLocation" type="text" placeholder="Location" required />
        <input id="newStorePassword" type="password" placeholder="Admin Password" required />
        <button onClick={handleRegisterInventory}>Register Inventory</button>
      </div>

      {!selectedStore ? (
        <div className="inventory-browser">
          <h2>Available Inventories</h2>
          <input
            type="text"
            placeholder="Search store..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <ul>
            {Object.entries(stores)
              .filter(([_, s]) => s.name.toLowerCase().includes(searchTerm))
              .map(([id, store]) => (
                <li key={id} onClick={() => setSelectedStore(id)}>
                  {store.name} ({store.location})
                </li>
              ))}
          </ul>
        </div>
      ) : !accessGranted[selectedStore] ? (
        <div className="password-prompt">
          <h3>{stores[selectedStore].name}</h3>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={adminInput}
            onChange={(e) => setAdminInput(e.target.value)}
          />
          <button onClick={handleAccess}>Access Inventory</button>
          <button onClick={() => {
            setShowPasswordModal(true);
            setDeletingStore(selectedStore);
          }}>🗑️ Delete Inventory</button>
          <button onClick={() => setSelectedStore(null)}>← Back</button>
        </div>
      ) : (
        <div className="inventory-section">
          <div className="header">
            <h1>{stores[selectedStore].name} Inventory</h1>
            <div>
              <button onClick={exportCSV}>Export CSV</button>
              <button onClick={exportPDF}>Export PDF</button>
              <button onClick={() => setSelectedStore(null)}>← Back</button>
            </div>
          </div>

          <div className="add-drug-form">
            <h3>Add Registered Drug</h3>
            <input name="name" placeholder="Drug Name" value={addDrugData.name}
              onChange={handleAddDrugChange} />
            <input name="batch" placeholder="Batch Number" value={addDrugData.batch}
              onChange={handleAddDrugChange} />
            <input name="expiry" type="date" value={addDrugData.expiry}
              onChange={handleAddDrugChange} />
            <input name="quantity" type="number" min="1" placeholder="Quantity"
              value={addDrugData.quantity} onChange={handleAddDrugChange} />
            <button onClick={handleAddDrug}>Add Drug</button>
            {addDrugError && <div className="error-msg">{addDrugError}</div>}
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              {stores[selectedStore].drugs.map((drug, i) => {
                const [status, color] = getStatus(drug.stock);
                return (
                  <tr key={i}>
                    <td>{drug.name}</td>
                    <td>{drug.batch}</td>
                    <td>{drug.expiry}</td>
                    <td>{drug.stock}</td>
                    <td style={{ color }}>{status}</td>
                    <td>
                      <button onClick={() => updateStock(selectedStore, i, 1)}>+</button>
                      <button onClick={() => updateStock(selectedStore, i, -1)}>−</button>
                      <button onClick={() => showTrend(drug)}>📈 View Trends</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Admin Password to Confirm Deletion</h3>
            <input
              type="password"
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
              placeholder="Admin Password"
            />
            <button onClick={confirmDelete}>Confirm Delete</button>
            <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <TrendModal
        isOpen={showTrendModal}
        onClose={() => setShowTrendModal(false)}
        drug={trendDrug}
        storeId={selectedStore}
      />

      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}
