import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './style.css';

export default function AdminLayout() {
  return (
    <div className="container-fluid" style={{ paddingTop: 100, maxWidth: 1800 }}>
  <div className="admin-layout">
    <div>
      <AdminSidebar />
    </div>
      <Outlet />
  </div>
</div>
  );
}
