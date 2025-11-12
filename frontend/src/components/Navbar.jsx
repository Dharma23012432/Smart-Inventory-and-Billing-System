import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/suppliers', label: 'Suppliers'},
    { path: '/low-stock', label: 'Low Stock', icon: '⚠️' },
    { path: '/sell', label: 'Sell', icon: '💰' }
  ];

  return (
    <nav style={{
      background: 'linear-gradient(to right, #0f1012ff, #4338ca)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      width: '100%'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              📦
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                Smart Inventory
              </div>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '8px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  color: isActive(link.path) ? '#1e40af' : 'white',
                  background: isActive(link.path) ? 'white' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive(link.path) ? '600' : '500',
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
