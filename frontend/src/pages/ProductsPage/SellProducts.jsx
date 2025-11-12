import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, sellProducts } from "../../api/productService";
import "./SellProduct.css";

const SellProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]); // ✅ For multiple products
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      setMessage({ type: "error", text: "❌ Failed to load products" });
    }
  };

  const handleProductSelect = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setQuantity("");
    setMessage({ type: "", text: "" });
  };

  // ✅ Add item to invoice list (not immediately selling)
  const handleAddToInvoice = () => {
    if (!selectedProduct || !quantity) {
      alert("⚠️ Please select a product and enter a quantity.");
      return;
    }

    if (parseInt(quantity) > selectedProduct.stock) {
      alert(`⚠️ Not enough stock! Only ${selectedProduct.stock} available.`);
      return;
    }

    // Add to invoice items
    const newItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      quantity: parseInt(quantity),
      price: selectedProduct.price,
    };

    setInvoiceItems([...invoiceItems, newItem]);

    // Reset input fields
    setSelectedProduct(null);
    setQuantity("");

    setMessage({
      type: "success",
      text: `✅ ${newItem.name} added to invoice.`,
    });

    setTimeout(() => setMessage({ type: "", text: "" }), 2000);
  };

  // ✅ Generate full invoice
  const handleGenerateInvoice = () => {
    if (invoiceItems.length === 0) {
      alert("⚠️ No products added to invoice.");
      return;
    }

    navigate("/invoice", { state: { items: invoiceItems } });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sell-product-container">
      <div className="sell-product-header">
        <div className="sell-product-header-content">
          <div className="sell-product-icon">💰</div>
          <div>
            <h1 className="sell-product-title">Sell Products</h1>
            <p className="sell-product-subtitle">
              Record sales and generate invoices
            </p>
          </div>
        </div>
      </div>

      <div className="sell-product-main">
        {message.text && (
          <div className={`sell-product-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="sell-product-card">
          <h2 className="sell-product-card-title">Sale Transaction</h2>

          {/* 🔍 Search bar */}
          <div className="sell-product-form-group">
            <label className="sell-product-label">Search Product</label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sell-product-input"
            />
          </div>

          {/* 📦 Product dropdown */}
          <div className="sell-product-form-group">
            <label className="sell-product-label">Select Product</label>
            <select
              value={selectedProduct?.id || ""}
              onChange={handleProductSelect}
              className="sell-product-select"
            >
              <option value="">-- Choose a product --</option>
              {filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (₹{product.price}) — Stock: {product.stock}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity input */}
          {selectedProduct && (
            <>
              <div className="sell-product-form-group">
                <label className="sell-product-label">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max={selectedProduct.stock}
                  className="sell-product-input"
                />
              </div>

              <div className="sell-product-actions">
                <button
                  onClick={handleAddToInvoice}
                  className="sell-product-button sell-product-button-primary"
                >
                  ➕ Add to Invoice
                </button>
              </div>
            </>
          )}
        </div>

        {/* 🧾 Invoice Preview Section */}
        {invoiceItems.length > 0 && (
          <div className="invoice-preview">
            <h3>🧾 Invoice Preview</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ background: "#4f46e5", color: "white" }}>
                  <th style={{ padding: "8px" }}>#</th>
                  <th style={{ padding: "8px" }}>Product</th>
                  <th style={{ padding: "8px" }}>Quantity</th>
                  <th style={{ padding: "8px" }}>Price (₹)</th>
                  <th style={{ padding: "8px" }}>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "8px" }}>{index + 1}</td>
                    <td style={{ padding: "8px" }}>{item.name}</td>
                    <td style={{ padding: "8px" }}>{item.quantity}</td>
                    <td style={{ padding: "8px" }}>{item.price.toFixed(2)}</td>
                    <td style={{ padding: "8px" }}>
                      {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={handleGenerateInvoice}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                🧾 Generate Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellProducts;
