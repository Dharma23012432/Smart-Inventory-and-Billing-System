import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard.jsx'; 
import ProductList from './pages/ProductsPage/ProductList.jsx';
import AddProducts from './pages/ProductsPage/AddProducts.jsx'; 
import EditProduct from './pages/ProductsPage/EditProduct.jsx';
import SupplierList from './pages/SupplierPage/SupplierList.jsx';
import AddSupplier from './pages/SupplierPage/AddSupplier.jsx'; 
import Navbar from './components/Navbar.jsx'; 
import EditSupplier from './pages/SupplierPage/EditSupplier.jsx';
import LowStockAlert from './pages/ProductsPage/LowStockAlert.jsx';
import SellProducts from './pages/ProductsPage/SellProducts.jsx';
import Reports from './pages/Reports.jsx';
import InvoicePage from './pages/ProductsPage/InvoicePage.jsx';

const App = () => {
  return (
    <BrowserRouter> 
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* --- PRODUCT ROUTES --- */}
          <Route path="/products" element={<ProductList />} />
          {/* <Route path="/products/add" element={<AddProduct />} /> */}
          <Route path="/edit-product/:id" element={<EditProduct />} /> 
          <Route path='/low-stock' element={<LowStockAlert/>}/>
          <Route path="/sell" element={<SellProducts />} />
          <Route path='/update/:id' element={<EditProduct/>}/>
          <Route path="/reports" element={<Reports />} />
          <Route path="/add-product" element={<AddProducts />} />
          <Route path='/invoice' element={<InvoicePage/>}/>


          {/* --- SUPPLIER ROUTES --- */}
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/add" element={<AddSupplier />} />
          <Route path="/suppliers/edit/:id" element={<EditSupplier />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;