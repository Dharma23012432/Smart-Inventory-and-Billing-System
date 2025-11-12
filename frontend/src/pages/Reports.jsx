import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Reports.css';

const Reports = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    healthyStockCount: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const productsRes = await axios.get('http://localhost:8080/api/products/view');
      const productsData = productsRes.data;
      setProducts(productsData);

      try {
        const suppliersRes = await axios.get('http://localhost:8080/api/suppliers/view');
        setSuppliers(suppliersRes.data);
      } catch (err) {
        console.log('Suppliers not available');
      }

      const totalStock = productsData.reduce((sum, p) => sum + p.stock, 0);
      const lowStock = productsData.filter(p => p.stock < p.minStock);
      const healthyStock = productsData.filter(p => p.stock >= p.minStock);

      setStats({
        totalProducts: productsData.length,
        totalStock: totalStock,
        lowStockCount: lowStock.length,
        healthyStockCount: healthyStock.length,
        totalValue: totalStock
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      setLoading(false);
    }
  };

  const stockLevelsData = products.slice(0, 10).map(p => ({
    name: p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name,
    stock: p.stock,
    minStock: p.minStock
  }));

  const stockStatusData = [
    { name: 'Low Stock', value: stats.lowStockCount, color: '#dc3545' },
    { name: 'Healthy', value: stats.healthyStockCount, color: '#28a745' }
  ];

  const supplierData = suppliers.slice(0, 5).map(s => {
    const productCount = products.filter(p => p.supplier?.id === s.id).length;
    return { name: s.name || 'Unknown', products: productCount };
  });

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Name', 'Stock', 'Min Stock', 'Status', 'Supplier'].join(','),
      ...products.map(p => [
        p.id,
        p.name,
        p.stock,
        p.minStock,
        p.stock < p.minStock ? 'Low' : 'Healthy',
        p.supplier?.email || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="reports-loading">
          <div className="reports-spinner"></div>
          <h2>Loading reports...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h1 className="reports-title">📈 Reports & Analytics</h1>
          <p className="reports-subtitle">Comprehensive overview of your inventory performance</p>
        </div>
        <div className="reports-header-actions">
          <button onClick={() => navigate('/')} className="reports-back-btn">← Back</button>
          <button onClick={exportToCSV} className="reports-export-btn">📥 Export CSV</button>
          <button onClick={printReport} className="reports-print-btn">🖨️ Print</button>
        </div>
      </div>

      <div className="reports-summary-grid">
        <div className="reports-stat-card blue">
          <div className="reports-stat-icon">📦</div>
          <div className="reports-stat-content">
            <div className="reports-stat-number">{stats.totalProducts}</div>
            <div className="reports-stat-label">Total Products</div>
          </div>
        </div>
        <div className="reports-stat-card green">
          <div className="reports-stat-icon">📊</div>
          <div className="reports-stat-content">
            <div className="reports-stat-number">{stats.totalStock}</div>
            <div className="reports-stat-label">Total Stock Units</div>
          </div>
        </div>
        <div className="reports-stat-card red">
          <div className="reports-stat-icon">⚠️</div>
          <div className="reports-stat-content">
            <div className="reports-stat-number">{stats.lowStockCount}</div>
            <div className="reports-stat-label">Low Stock Items</div>
          </div>
        </div>
        <div className="reports-stat-card purple">
          <div className="reports-stat-icon">✅</div>
          <div className="reports-stat-content">
            <div className="reports-stat-number">{stats.healthyStockCount}</div>
            <div className="reports-stat-label">Healthy Stock</div>
          </div>
        </div>
      </div>

      <div className="reports-charts-grid">
        <div className="reports-chart-card">
          <h3 className="reports-chart-title">📊 Stock Levels (Top 10 Products)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevelsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#4f46e5" name="Current Stock" />
              <Bar dataKey="minStock" fill="#f59e0b" name="Min Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="reports-chart-card">
          <h3 className="reports-chart-title">📈 Stock Health Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {suppliers.length > 0 && (
          <div className="reports-chart-card full-width">
            <h3 className="reports-chart-title">🏢 Products by Supplier</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="products" fill="#8b5cf6" name="Number of Products" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="reports-table-section">
        <h3 className="reports-section-title">📋 Detailed Product Report</h3>
        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Stock</th>
                <th>Min Stock</th>
                <th>Status</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td className={p.stock < p.minStock ? 'low-stock' : ''}>{p.stock}</td>
                  <td>{p.minStock}</td>
                  <td>
                    {p.stock < p.minStock ? (
                      <span className="reports-status-badge danger">⚠️ Low</span>
                    ) : (
                      <span className="reports-status-badge success">✅ Healthy</span>
                    )}
                  </td>
                  <td>{p.supplier?.email || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
