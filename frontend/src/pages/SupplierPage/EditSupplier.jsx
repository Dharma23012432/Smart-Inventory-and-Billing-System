import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSupplierById, updateSupplier } from '../../api/supplierService';
import styles from '../ProductsPage/EditProduct.module.css'; // Reuse product edit styles

const EditSupplier = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [supplier, setSupplier] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. Fetch existing supplier data
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await getSupplierById(id);
        const fetchedSupplier = response.data;
        
        setSupplier({
          name: fetchedSupplier.name || '',
          mobile: fetchedSupplier.mobile || '',
          email: fetchedSupplier.email || '',
          company: fetchedSupplier.company || '',
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching supplier:", error);
        setMessage('❌ Failed to load supplier data. Check backend GET endpoint.');
        setLoading(false);
      }
    };
    
    if (id) {
        fetchSupplier();
    }
  }, [id]);

  // 2. Handle input changes
  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Handle form submission (PUT method)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      await updateSupplier(id, supplier);
      setMessage('✅ Supplier updated successfully!');
      // Navigate back to the supplier list after a brief delay
      setTimeout(() => navigate('/suppliers'), 1000); 
    } catch (error) {
      console.error("Error updating supplier:", error);
      setMessage('❌ Failed to update supplier. Check backend PUT endpoint.');
    }
  };

  if (loading) {
    return <h2 className={styles.title} style={{ marginTop: '50px' }}>Loading Supplier...</h2>;
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Supplier (ID: {id})</h2>
      {message && <p className={styles.message}>{message}</p>}
      
      <form onSubmit={handleSubmit} className={styles.formCard}>
        
        <input name="name" value={supplier.name} onChange={handleChange} placeholder="Supplier Name" required className={styles.inputField} />
        <input name="mobile" value={supplier.mobile} onChange={handleChange} placeholder="Mobile Number" required type="text" className={styles.inputField} />
        <input name="email" value={supplier.email} onChange={handleChange} placeholder="Email" required type="email" className={styles.inputField} />
        <input name="company" value={supplier.company} onChange={handleChange} placeholder="Company Name" required className={styles.inputField} />

        <button type="submit" className={styles.btnUpdate}>
          Update Supplier
        </button>
      </form>
    </div>
  );
};

export default EditSupplier;