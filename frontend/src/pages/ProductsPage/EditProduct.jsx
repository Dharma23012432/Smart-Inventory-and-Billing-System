import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../../api/productService'; 
import styles from './EditProduct.module.css'; // 👈 IMPORT THE STYLES

const EditProduct = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: '',
    price:0,
    stock: 0,
    minStock: 0,
    supplierId: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // --- Data Fetching Logic (UNCHANGED) ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const fetchedProduct = response.data;
        
        setProduct({
          name: fetchedProduct.name,
          price: fetchedProduct.price,
          stock: fetchedProduct.stock,
          minStock: fetchedProduct.minStock,
          supplierId: fetchedProduct.supplier ? fetchedProduct.supplier.id : 0, 
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setMessage('❌ Failed to load product data. Check backend GET endpoint.');
        setLoading(false);
      }
    };
    
    if (id) {
        fetchProduct();
    }
  }, [id]); 

  // --- Form Handling Logic (UNCHANGED) ---
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const updatedData = {
      name: product.name,
      price: product.price,
      stock: parseInt(product.stock, 10),
      minStock: parseInt(product.minStock, 10),
      supplier: { id: parseInt(product.supplierId, 10) }, 
    };

    try {
      await updateProduct(id, updatedData);
      setMessage('✅ Product updated successfully!');
      setTimeout(() => navigate('/products'), 1500); 
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage('❌ Failed to update product. Check backend PUT endpoint.');
    }
  };

  if (loading) {
    return <h2 className={styles.title} style={{ marginTop: '50px' }}>Loading Product...</h2>;
  }
  
  // --- CLEANED UP JSX WITH CSS MODULE CLASSES ---
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Product (ID: {id})</h2>
      {message && <p className={styles.message}>{message}</p>}
      
      <form onSubmit={handleSubmit} className={styles.formCard}>
        
        {/* Product Name */}
        <input 
          name="name" 
          value={product.name} 
          onChange={handleChange} 
          placeholder="Product Name" 
          required 
          className={styles.inputField}
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Enter new price"
          required
          min="0"
          step="0.01"
          className={styles.inputField}
        />


        {/* Stock Quantity */}
        <input 
          name="stock" 
          value={product.stock} 
          onChange={handleChange} 
          placeholder="Stock" 
          required 
          type="number" 
          min="0"
          className={styles.inputField}
        />
        
        {/* Min Stock */}
        <input 
          name="minStock" 
          value={product.minStock} 
          onChange={handleChange} 
          placeholder="Min Stock" 
          required 
          type="number" 
          min="0"
          className={styles.inputField}
        />
        
        {/* Supplier ID */}
        <input 
          name="supplierId" 
          value={product.supplierId} 
          onChange={handleChange} 
          placeholder="Supplier ID" 
          required 
          type="number" 
          min="0"
          className={styles.inputField}
        />

        <button type="submit" className={styles.btnUpdate}>
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;