// TrendModal.jsx
// import React from "react";

// const TrendModal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null; // <- This line hides it by default

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>&times;</span>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default TrendModal;


import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const TrendModal = ({ isOpen, onClose, drug, storeId }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !drug || !storeId) return;

    const historyKey = `trend-${storeId}-${drug.name}-${drug.batch}-${drug.expiry}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");

    // Filter to last 30 days
    const now = new Date();
    const filtered = history.filter(
      (entry) => new Date(entry.timestamp) >= new Date(now.setDate(now.getDate() - 30))
    );

    const labels = filtered.map((entry) =>
      new Date(entry.timestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    );
    const dataPoints = filtered.map((entry) => entry.stock);

    const ctx = canvasRef.current.getContext("2d");

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `${drug.name} Stock Trend`,
            data: dataPoints,
            borderColor: "#36a2eb",
            backgroundColor: "rgba(54,162,235,0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Stock" },
          },
          x: {
            title: { display: true, text: "Date" },
          },
        },
      },
    });
  }, [isOpen, drug, storeId]);

  if (!isOpen || !drug) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Stock Trend: {drug.name}</h3>
        <canvas ref={canvasRef} width="400" height="250"></canvas>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TrendModal;
