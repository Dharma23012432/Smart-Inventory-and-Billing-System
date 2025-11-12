import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductList.module.css";

import {
  getAllProducts,
  deleteProduct,
  deleteAllProducts,
  sellProducts,
} from "../../api/productService";

const ProductList = () => {
  // === STATE ===
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all");
  const [sortDirection, setSortDirection] = useState("dec"); // 'asc' for Smallest, 'desc' for Largest
  
  const [products, setProducts] = useState([]);
  
  const [isSearching, setIsSearching] = useState(false); 
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  const navigate = useNavigate();

  const handleAddProductClick = useCallback(() => {
    navigate('/add-product'); // Navigate to your Add Product form page
}, [navigate]);


  const performStockUpdate = useCallback(async (id, soldQuantity) => {
    try {
      const newProducts = products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            stock: product.stock - soldQuantity,
          };
        }
        return product;
      });
      setProducts(newProducts);
      await sellProducts(id, soldQuantity);
    } catch (error) {
      console.error("Error updating stock:", error);
      getAllProducts(searchTerm, filterStock, 'stock', sortDirection).then((res) => setProducts(res.data));
    }
  }, [products, searchTerm, filterStock, sortDirection]); 

  const handleSellCLick = useCallback((product) => {
    const soldQuantityStr = window.prompt(
      `How many "${product.name}" you want to sell`,
      "1"
    );

    if (soldQuantityStr == null) { return; }
    const soldQuanties = parseInt(soldQuantityStr, 10);

    if (isNaN(soldQuanties) || soldQuanties <= 0) {
      alert("Please enter a valid number greater than 0.");
      return;
    }

    if (soldQuanties > product.stock) {
      alert(`Error: You only have ${product.stock} in stock.`);
      return;
    }
    performStockUpdate(product.id, soldQuanties);
  }, [performStockUpdate]); 

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("You want to delete this")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting Product", err);
      }
    }
  }, [products]); 

  const handleDeleteAll = useCallback(async () => {
    if (window.confirm("Delete all Products ?")) {
      try {
        await deleteAllProducts();
        setProducts([]);
      } catch (error) {
        console.error("Error", error);
      }
    }
  }, []); 

  const handleEdit = useCallback((id) => {
    navigate(`/edit-product/${id}`);
  }, [navigate]); 

  // === EFFECT HOOK (Debounced Search) ===
  useEffect(() => {
    if (!isLoadingInitial) {
      setIsSearching(true);
    }

    // Hardcode the field to 'stock' for sorting
    const sortField = 'stock'; 

    const timer = setTimeout(() => {
      // Pass the hardcoded sortField along with direction
      getAllProducts(searchTerm, filterStock, null, sortField, sortDirection) 
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
        })
        .finally(() => {
          setIsSearching(false);
          setIsLoadingInitial(false);
        });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
    // Dependencies are now simpler
  }, [searchTerm, filterStock, sortDirection]); 

  // --- INITIAL LOADING RENDER ---
  if (isLoadingInitial) return <h2 style={{ textAlign: "center", marginTop: "40vh" }}>Loading Initial Data...</h2>;

  // --- MAIN RENDER ---
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Product List</h2>

      {/* --- CONTROLS: Search, Filters, and Sort --- */}
      <div className={styles.controlsContainer} style={{ justifyContent: 'flex-start', gap: '15px' }}>
        
        {/* 1. SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search by name..."
          className={styles.searchInput} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '40%' }} // Adjust width to fit 3 controls
        />

        {/* 2. STOCK FILTER */}
        <select
            className={styles.selectInput} 
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            style={{ width: '30%' }} // Adjust width
        >
            <option value="all">Stock: All</option>
            <option value="low">Stock: Low</option>
            <option value="healthy">Stock: Healthy</option>
        </select>
            
        {/* 3. SORT DIRECTION (Smallest/Largest) */}
        <select
            className={styles.selectInput} 
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            style={{ width: '30%' }} // Adjust width
        >
            <option value="asc">Smallest</option>
            <option value="desc">Largest</option>
        </select>
        
      </div>
      {/* --- DYNAMIC CONTENT AREA --- */}
      {isSearching ? (
        <h3 style={{ textAlign: "center", marginTop: "40px" }}>Searching...</h3>
      ) : products.length === 0 ? (
        <p>No products found for this search.</p>
      ) : (
        <table className={styles.table}>
          {/* ... Table structure ... */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td className={p.stock < p.minStock ? styles.lowStock : ""}>
                  {p.stock}
                </td>
                <td>{p.minStock}</td>
                <td>{p.supplier ? p.supplier.email : "N/A"}</td>
                <td className={styles.actionsCell}>
                  
                  <button
                    onClick={() => handleEdit(p.id)}
                    className={`${styles.btn} ${styles.btnEdit}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className={`${styles.btn} ${styles.btnDelete}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    <div style={{ 
        marginTop: "20px", 
        display: "flex",           
        justifyContent: "center",  
        alignItems: "center",     
        gap: "15px"               
    }}>
      <button
            onClick={handleAddProductClick}
            className={styles.btnAddProduct} // We will define this green style in CSS
        >
            + Add New Product
        </button>
      <button
        onClick={handleDeleteAll}
        className={`${styles.btn} ${styles.btnDeleteAll}`}
        style={{ marginTop: "10px" }}
      >
        Delete All Products
      </button></div>
      
    </div>
  );
};

export default ProductList;