import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/NavBar';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;