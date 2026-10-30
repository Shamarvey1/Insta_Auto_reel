import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-fuchsia-500 selection:text-white">
      <Navbar />
      <div className="flex-1">
        <Dashboard />
      </div>
    </div>
  );
}

