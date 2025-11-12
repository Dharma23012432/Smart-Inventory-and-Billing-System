import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addSupplier } from '../../api/supplierService'; 
import styles from '../ProductsPage/EditProduct.module.css';


const AddSupplier = () => {
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState({
        name: '',
        mobile: '',
        email: '',
        company: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setSupplier({
            ...supplier,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await addSupplier(supplier);
            setMessage('✅ Supplier added successfully!');
            
            // Navigate to the list page after successful creation
            setTimeout(() => navigate('/suppliers'), 1000); 

        } catch (error) {
            console.error("Error adding supplier:", error);
            setMessage('❌ Failed to add supplier. Check backend logs.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Add New Supplier</h2>
            
            <form onSubmit={handleSubmit} className={styles.formCard}>
                
                {/* Supplier Name */}
                <input 
                    name="name" 
                    value={supplier.name} 
                    onChange={handleChange} 
                    placeholder="Supplier Name" 
                    required 
                    className={styles.inputField}
                />
                
                {/* Mobile Number */}
                <input 
                    name="mobile" 
                    value={supplier.mobile} 
                    onChange={handleChange} 
                    placeholder="Mobile Number" 
                    required 
                    className={styles.inputField}
                />

                {/* Email */}
                <input 
                    name="email" 
                    value={supplier.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                    type="email"
                    className={styles.inputField}
                />

                {/* Company Name */}
                <input 
                    name="company" 
                    value={supplier.company} 
                    onChange={handleChange} 
                    placeholder="Company Name" 
                    required 
                    className={styles.inputField}
                />

                <button type="submit" className={styles.btnUpdate}>
                    Add Supplier
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default AddSupplier;