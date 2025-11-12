// ...existing code...
import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    minStock: "",
    supplierId: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedProduct = {
      name: product.name,
      price: parseInt(product.price,10),
      stock: parseInt(product.stock, 10),
      minStock: parseInt(product.minStock, 10),
      supplier: { id: parseInt(product.supplierId, 10) },
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/products/add",
        formattedProduct
      );
      setMessage("✅ Product added successfully!");
      console.log("Product added:", response.data);

      // clear form
      setProduct({
        name: "",
        price: "",
        stock: "",
        minStock: "",
        supplierId: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("❌ Failed to add product. Check backend logs.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "700px",
        margin: "80px auto 20px auto", // space for fixed navbar and centered
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 1)",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "18px" }}>
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product name"
            required
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #c4c4c4ff",
              fontSize: "16px",
            }}
          />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Enter product price"
            required
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #c4c4c4ff",
              fontSize: "16px",
            }}
          />
          <input
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock (number)"
            required
            type="number"
            min="0"
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "16px",
            }}
          />

          <input
            name="minStock"
            value={product.minStock}
            onChange={handleChange}
            placeholder="Min Stock (number)"
            required
            type="number"
            min="0"
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "16px",
            }}
          />

          <input
            name="supplierId"
            value={product.supplierId}
            onChange={handleChange}
            placeholder="Supplier ID (number)"
            required
            type="number"
            min="0"
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "16px",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#4338ca",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 600,
              marginTop: "6px",
            }}
          >
            Add Product
          </button>
        </form>

        {message && <p style={{ marginTop: "14px" }}>{message}</p>}
      </div>
    </div>
  );
}

export default AddProduct;
