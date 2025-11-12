import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Get all products

export const getAllProducts = async (search, stockLevel, filterSize, sortField, sortDirection) => {
  
  const params = new URLSearchParams();

  if (search) {
    params.append('search', search);
  }
  
  if (stockLevel && stockLevel !== 'all') {
    params.append('stockLevel', stockLevel);
  }
  
  if (filterSize && filterSize !== 'all') { 
    params.append('size', filterSize);
  }

  if (sortField) {
    params.append('sortField', sortField);
    params.append('sortDirection', sortDirection);
  }

  return axios.get(`${BASE_URL}/api/products/view?${params.toString()}`);
};

// Add a new product
export const addProduct = async (product) =>
  axios.post(`${BASE_URL}/api/products/add`, product);

// Sell product / update stock
export const sellProducts = async (id, soldQuantity) =>
  axios.put(`${BASE_URL}/api/products/${id}/sell/${soldQuantity}`);

// Uppdate Product
export const getProductById = async (id) =>
  axios.get(`${BASE_URL}/api/products/${id}`);

export const updateProduct = async (id, updatedProduct) =>
  axios.put(`${BASE_URL}/api/products/update/${id}`, updatedProduct);

// Delete Product by ID
export const deleteProduct = async(id) =>
  axios.delete(`${BASE_URL}/api/products/delete/${id}`)

// Delete All
export const deleteAllProducts = async() => 
  axios.delete(`${BASE_URL}/api/products/deleteAll`)

// get low-stock products
export const getLowStockProducts = async() => 
  axios.get(`${BASE_URL}/api/products/low-stock`)



