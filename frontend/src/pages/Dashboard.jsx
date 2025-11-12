import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';
import { getAllProducts } from '../api/productService';
import { getAllSuppliers } from '../api/supplierService';

const Dashboard = () => {
  const navigate = useNavigate();

  const[stats, setStats] = useState({
    totalProducts:0,
    lowStockCount:0,
    healthyStockCount:0,
    totalSuppliers:0
  })

  const[products, setProducts] = useState([]);
  const[suppliers, setSuppliers] = useState([]);
  const[loading, setLoading] = useState(true);
  const[chartData, setChartData] = useState([]);
  const[categoryData, setCategoryData] = useState([]);  

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData,30000)
    return () => clearInterval(interval);
  },[]);

    const fetchDashboardData = async() => {
      try{
        // getting all products details
        const productRe = await getAllProducts();
        const productData = productRe.data;
        setProducts(productData);
        
        // getting all suppliers details
        try{
          const suppliersRes = await getAllSuppliers();
          setSuppliers(suppliersRes.data);
        }catch(err){
          console.error("Suppliers endpoint not available yet",err);
          setSuppliers([]);
        }

        // get the low stock products and helathy products
        const lowProducts = productData.filter((p) => p.stock < p.minStock)
        const healthyProducts = productData.filter((p) => p.stock > p.minStock);

        // set the stats
        setStats({
          totalProducts:productData.length,
          lowStockCount:lowProducts.length,
          healthyStockCount:healthyProducts.length,
          totalSuppliers:suppliers.length
        })

        const topProducts = [...productData]
          .sort((a,b) => b.stock-a.stock)
          .slice(0,5)
          .map((p) => ({
            name: p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name,
            stock: p.stock,
            minStock: p.minStock,
          }))
        
          setChartData(topProducts);

          const categories = {};
            productData.forEach(p => {
              const category = p.category || 'Other';
              categories[category] = (categories[category] || 0) + 1;
            });

            const categoryArray = Object.keys(categories).map(key => ({
              name: key,
              value: categories[key],
            }));
            setCategoryData(categoryArray);

            setLoading(false);
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
          }
      }
      const COLORS = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }


  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">📊 Inventory Dashboard</h1>
          <p className="dashboard-subtitle">
            Quick overview of your store's inventory health
          </p>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="dashboard-refresh-btn"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        {/* Total Products */}
        <div className="dashboard-stat-card blue">
          <div className="dashboard-stat-icon">📦</div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-number">{stats.totalProducts}</div>
            <div className="dashboard-stat-label">Total Products</div>
          </div>
        </div>

        {/* Low Stock */}
        <div 
          className="dashboard-stat-card red clickable"
          onClick={() => navigate('/low-stock')}
        >
          <div className="dashboard-stat-icon">⚠️</div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-number">{stats.lowStockCount}</div>
            <div className="dashboard-stat-label">Low Stock Items</div>
          </div>
          {stats.lowStockCount > 0 && (
            <div className="dashboard-stat-badge">Action Needed</div>
          )}
        </div>

        {/* Healthy Stock */}
        <div className="dashboard-stat-card green"
          onClick = {() => navigate('/healthy')}>
          <div className="dashboard-stat-icon">✅</div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-number">{stats.healthyStockCount}</div>
            <div className="dashboard-stat-label">Healthy Stock</div>
          </div>
        </div>

        {/* Total Suppliers */}
        <div 
          className="dashboard-stat-card purple clickable"
          onClick={() => navigate('/suppliers')}
        >
          <div className="dashboard-stat-icon">🏢</div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-number">{stats.totalSuppliers}</div>
            <div className="dashboard-stat-label">Suppliers</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts-grid">
        
        {/* Bar Chart - Top Products */}
        <div className="dashboard-chart-card">
          <h3 className="dashboard-chart-title">Top 5 Products by Stock</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#667eea" name="Current Stock" />
              <Bar dataKey="minStock" fill="#f59e0b" name="Min Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-actions-grid">
          <button 
            className="dashboard-action-btn add"
            onClick={() => navigate('/add-product')}
          >
            <span className="dashboard-action-icon">➕</span>
            <span>Add Product</span>
          </button>
          
          <button 
            className="dashboard-action-btn sell"
            onClick={() => navigate('/sell')}
          >
            <span className="dashboard-action-icon">💰</span>
            <span>Sell Product</span>
          </button>
          
          <button 
            className="dashboard-action-btn view"
            onClick={() => navigate('/products')}
          >
            <span className="dashboard-action-icon">📋</span>
            <span>View All</span>
          </button>
          
          <button 
            className="dashboard-action-btn alert"
            onClick={() => navigate('/low-stock')}
          >
            <span className="dashboard-action-icon">⚠️</span>
            <span>Low Stock</span>
          </button>

          {/* ADD THIS - Reports Button */}
          <button 
            className="dashboard-action-btn reports"
            onClick={() => navigate('/reports')}
          >
            <span className="dashboard-action-icon">📈</span>
            <span>Reports</span>
          </button>
        </div>

        {/* Pie Chart - Categories */}
        <div className="dashboard-chart-card">
          <h3 className="dashboard-chart-title">Products by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-quick-actions">
        <h3 className="dashboard-section-title">Quick Actions</h3>
        <div className="dashboard-actions-grid">
          <button 
            className="dashboard-action-btn add"
            onClick={() => navigate('/add-product')}
          >
            <span className="dashboard-action-icon">➕</span>
            <span>Add Product</span>
          </button>
          
          <button 
            className="dashboard-action-btn sell"
            onClick={() => navigate('/sell')}
          >
            <span className="dashboard-action-icon">💰</span>
            <span>Sell Product</span>
          </button>
          
          <button 
            className="dashboard-action-btn view"
            onClick={() => navigate('/products')}
          >
            <span className="dashboard-action-icon">📋</span>
            <span>View All</span>
          </button>
          
          <button 
            className="dashboard-action-btn alert"
            onClick={() => navigate('/low-stock')}
          >
            <span className="dashboard-action-icon">⚠️</span>
            <span>Low Stock</span>
          </button>
        </div>
      </div>

      {/* Low Stock Alert List */}
      {stats.lowStockCount > 0 && (
        <div className="dashboard-alerts">
          <div className="dashboard-alerts-header">
            <h3 className="dashboard-section-title">🚨 Critical Alerts</h3>
            <button 
              className="dashboard-view-all-btn"
              onClick={() => navigate('/low-stock')}
            >
              View All →
            </button>
          </div>
          <div className="dashboard-alerts-list">
            {products
              .filter(p => p.stock < p.minStock)
              .slice(0, 5)
              .map(product => (
                <div key={product.id} className="dashboard-alert-item">
                  <div className="dashboard-alert-icon">⚠️</div>
                  <div className="dashboard-alert-content">
                    <div className="dashboard-alert-name">{product.name}</div>
                    <div className="dashboard-alert-details">
                      Stock: <span className="danger">{product.stock}</span> / 
                      Min: <span>{product.minStock}</span>
                    </div>
                  </div>
                  <button 
                    className="dashboard-alert-action"
                    onClick={() => navigate('/low-stock')}
                  >
                    Fix
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Products */}
      <div className="dashboard-recent">
        <h3 className="dashboard-section-title">Recent Products</h3>
        <div className="dashboard-products-grid">
          {products.slice(0, 6).map(product => (
            <div key={product.id} className="dashboard-product-card">
              <div className="dashboard-product-header">
                <h4>{product.name}</h4>
                {product.stock < product.minStock && (
                  <span className="dashboard-product-badge low">Low</span>
                )}
                {product.stock >= product.minStock && (
                  <span className="dashboard-product-badge healthy">OK</span>
                )}
              </div>
              <div className="dashboard-product-info">
                <div className="dashboard-product-row">
                  <span>Stock:</span>
                  <span className={product.stock < product.minStock ? 'danger' : 'success'}>
                    {product.stock}
                  </span>
                </div>
                <div className="dashboard-product-row">
                  <span>Min Stock:</span>
                  <span>{product.minStock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
    