import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSuppliers, deleteSupplierById, deleteAllSupplier } from '../../api/supplierService';
import styles from '../ProductsPage/ProductList.module.css';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSuppliers = async () => {
        try {
            const response = await getAllSuppliers();
            setSuppliers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Deleting a supplier will set their products' supplier field to NULL. Continue?")) {
            try {
                await deleteSupplierById(id);
                // Optimistic update: filter out the deleted supplier
                setSuppliers(suppliers.filter(s => s.id !== id));
            } catch (err) {
                console.error("Error deleting supplier:", err);
            }
        }
    };
    
    const handleDeleteAll = async () => {
        if (window.confirm("WARNING: This will delete ALL suppliers and remove supplier links from all products. Proceed?")) {
            try {
                await deleteAllSupplier();
                setSuppliers([]);
            } catch (error) {
                console.error("Error deleting all suppliers:", error);
            }
        }
    };

    const handleAddSupplierClick = () => {
        navigate('/suppliers/add');
    };

    if (loading) return <h2 style={{ textAlign: "center", marginTop: "40vh" }}>Loading Suppliers...</h2>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Supplier Management</h2>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
                 <button
                    onClick={handleAddSupplierClick}
                    className={styles.btnAddProduct} // Reuse the green button style
                >
                    + Add New Supplier
                </button>
                <button
                    onClick={handleDeleteAll}
                    className={`${styles.btn} ${styles.btnDeleteAll}`}
                >
                    Delete All Suppliers
                </button>
            </div>
            
            {suppliers.length === 0 ? (
                <p>No suppliers found.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((s) => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.name}</td>
                                <td>{s.company}</td>
                                <td>{s.email}</td>
                                <td>{s.mobile}</td>
                                <td className={styles.actionsCell}>
                                    <button 
                                        onClick={() => navigate(`/suppliers/edit/${s.id}`)} 
                                        className={`${styles.btn} ${styles.btnEdit}`}>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(s.id)} 
                                        className={`${styles.btn} ${styles.btnDelete}`}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SupplierList;