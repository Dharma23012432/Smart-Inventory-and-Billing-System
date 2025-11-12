import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

// Add a Supplier
export const addSupplier = async(supplier) =>
  axios.post(`${BASE_URL}/supplier/create`,supplier)

// Get all Suppliers
export const getAllSuppliers = async() =>
  axios.get(`${BASE_URL}/supplier/view`);

// Get suppliers by id
export const getSupplierById = async(id) =>
  axios.get(`${BASE_URL}/supplier/id/${id}`) 

// Delete Supplier BY id
export const deleteSupplierById = async(id) =>
  axios.delete(`${BASE_URL}/supplier/delete/${id}`)

// Delete All Supplier
export const deleteAllSupplier = async() =>
  axios.deleteAll(`${BASE_URL}/supplier/deleteAll`)



// Update Supplier
export const updateSupplier = async(id, updatedSupplier) =>
  // Assuming your backend uses /supplier/id/{id} for PUT requests
  axios.put(`${BASE_URL}/supplier/update/${id}`, updatedSupplier);