import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateReel from './pages/CreateReel';
import Progress from './pages/Progress';
import Preview from './pages/Preview';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateReel />} />
            <Route path="/progress/:jobId" element={<Progress />} />
            <Route path="/preview/:id" element={<Preview />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
