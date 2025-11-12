import React, { useState, useEffect } from "react";
import { getLowStockProducts, updateProduct } from "../../api/productService";
import styles from "./LowStockAlert.module.css";
import EditProduct from "./EditProduct";
import { useNavigate } from "react-router-dom";

const LowStock = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const navigate = useNavigate();

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getLowStockProducts();
      setLowStockProducts(response.data);
    } catch (error) {
      console.error("Error fetching low stock:", error);
      setError("Failed to load low stock products. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const emailSender = (supplierEmail, productName, currentStock) => {
    const subject = `Low Stock Alert - ${productName}`;
    const body = `Dear Supplier,

Our product "${productName}" is running low with only ${currentStock} units remaining.

Please arrange to restock this item at your earliest convenience.

Best regards,
Smart Inventory Team`;

    <a
  href={`mailto:${supplierEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
  className={styles["low-stock-email-button"]}
>
  📧 Email Supplier
</a>
  };

  // fetch on mount
  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  // auto-refresh every 30s
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLowStockProducts();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);
  

  // Loading state
  if (loading) {
    return (
      <div className={styles["low-stock-container"]}>
        <div className={styles["low-stock-loading-box"]}>
          <div className={styles["low-stock-spinner"]}></div>
          <h2>Loading low stock alerts...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles["low-stock-container"]}>
        <div className={styles["low-stock-error-box"]}>
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchLowStockProducts}
            className={styles["low-stock-retry-button"]}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Main layout
  return (
    <div className={styles["low-stock-container"]}>
      {/* Header */}
      <div className={styles["low-stock-header"]}>
        <div>
          <h1 className={styles["low-stock-title"]}>⚠️ Low Stock Alerts</h1>
          <p className={styles["low-stock-subtitle"]}>
            Products that need immediate attention
          </p>
        </div>

        <div className={styles["low-stock-controls"]}>
          <label className={styles["low-stock-toggle-label"]}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (30s)
          </label>

          <button
            onClick={fetchLowStockProducts}
            className={styles["low-stock-refresh-button"]}
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles["low-stock-stats-bar"]}>
        <div className={styles["low-stock-stat-card"]}>
          <div className={styles["low-stock-stat-number"]}>
            {lowStockProducts.length}
          </div>
          <div className={styles["low-stock-stat-label"]}>
            Products Need Restock
          </div>
        </div>
      </div>

      {/* Product list */}
      {lowStockProducts.length === 0 ? (
        <div className={styles["low-stock-empty-state"]}>
          <div className={styles["low-stock-empty-icon"]}>✅</div>
          <h2>All Good!</h2>
          <p>No products are currently low on stock.</p>
        </div>
      ) : (
        <div className={styles["low-stock-product-grid"]}>
          {lowStockProducts.map((product) => {
            const deficit = product.minStock - product.stock;

            return (
              <div key={product.id} className={styles["low-stock-product-card"]}>
                <div className={styles["low-stock-urgent-badge"]}>🚨 URGENT</div>

                <h3 className={styles["low-stock-product-name"]}>
                  {product.name}
                </h3>

                <div className={styles["low-stock-stock-info"]}>
                  <div className={styles["low-stock-stock-row"]}>
                    <span>Current Stock:</span>
                    <span className={styles["low-stock-danger-text"]}>
                      {product.stock} units
                    </span>
                  </div>
                  <div className={styles["low-stock-stock-row"]}>
                    <span>Required:</span>
                    <span>{product.minStock} units</span>
                  </div>
                  <div className={styles["low-stock-stock-row"]}>
                    <span>Need:</span>
                    <span className={styles["low-stock-warning-text"]}>
                      +{deficit} units
                    </span>
                  </div>
                </div>

                <div className={styles["low-stock-progress-bar"]}>
                  <div
                    className={styles["low-stock-progress-fill"]}
                    style={{
                      width: `${(product.stock / product.minStock) * 100}%`,
                    }}
                  />
                </div>

                <p className={styles["low-stock-percentage-text"]}>
                  {Math.round((product.stock / product.minStock) * 100)}% of
                  minimum
                </p>

                <div className={styles["low-stock-supplier-info"]}>
                  <strong>Supplier:</strong>
                  <p>{product.supplier?.email || "No supplier"}</p>
                </div>

                <div className={styles["low-stock-actions"]}>
                  <button
                    onClick={() =>
                      emailSender(
                        product.supplier?.email,
                        product.name,
                        product.stock
                      )
                    }
                    className={styles["low-stock-email-button"]}
                    disabled={!product.supplier?.email}
                  >
                    📧 Email Supplier
                  </button>
                  <button 
                        onClick={() =>
                            navigate(`/update/${product.id}`)}
                        className={styles["low-stock-restock-button"]}>
                    📦 Restock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LowStock;
