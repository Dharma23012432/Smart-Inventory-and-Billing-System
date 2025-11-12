import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InvoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const itemsFromState = location.state?.items || [];

  const [invoiceItems, setInvoiceItems] = useState(itemsFromState);
  const [gstRate] = useState(18); 
  const [cgstRate] = useState(9);
  const [sgstRate] = useState(9);

  const [totals, setTotals] = useState({
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
  });

  useEffect(() => {
    const subtotal = invoiceItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const cgst = (subtotal * cgstRate) / 100;
    const sgst = (subtotal * sgstRate) / 100;
    const total = subtotal + cgst + sgst;

    setTotals({ subtotal, cgst, sgst, total });
  }, [invoiceItems, cgstRate, sgstRate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "30px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#4f46e5" }}>🧾 Tax Invoice</h1>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        <p><strong>Invoice No:</strong> INV-{Math.floor(Math.random() * 10000)}</p>
        <p><strong>GST Rate:</strong> {gstRate}% (CGST {cgstRate}% + SGST {sgstRate}%)</p>
      </div>

      {/* === Table === */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#4f46e5",
              color: "white",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "10px" }}>#</th>
            <th style={{ padding: "10px" }}>Product</th>
            <th style={{ padding: "10px" }}>Quantity</th>
            <th style={{ padding: "10px" }}>Price (₹)</th>
            <th style={{ padding: "10px" }}>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{index + 1}</td>
              <td style={{ padding: "10px" }}>{item.name}</td>
              <td style={{ padding: "10px" }}>{item.quantity}</td>
              <td style={{ padding: "10px" }}>{item.price.toFixed(2)}</td>
              <td style={{ padding: "10px" }}>
                {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === Totals Section === */}
      <div style={{ marginTop: "30px", textAlign: "right", fontSize: "18px" }}>
        <p>Subtotal: ₹{totals.subtotal.toFixed(2)}</p>
        <p>CGST ({cgstRate}%): ₹{totals.cgst.toFixed(2)}</p>
        <p>SGST ({sgstRate}%): ₹{totals.sgst.toFixed(2)}</p>
        <hr style={{ margin: "10px 0" }} />
        <h3 style={{ marginTop: "10px", color: "#10b981" }}>
          Grand Total: ₹{totals.total.toFixed(2)}
        </h3>
      </div>

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <button
          onClick={handlePrint}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🖨️ Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
