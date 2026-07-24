import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Menu, X, LayoutDashboard, BarChart2, Upload, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleTakeSnapshot = async () => {
    const reportElement = document.getElementById('student-dashboard-report');
    if (!reportElement) return;

    setIsCapturing(true);
    try {
      const dataUrl = await toPng(reportElement, {
        quality: 0.95,
        backgroundColor: '#F8FAFC',
        cacheBust: true,
      });

      const link = document.createElement('a');
      const formattedDate = new Date().toISOString().split('T')[0];
      const filename = `GDPI_Evaluation_Snapshot_${formattedDate}.png`;

      link.href = dataUrl;
      link.download = filename;
      link.click();
    } catch (err) {
      console.error('Failed to capture snapshot:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navbar with solid premium deep blue (#1E3A8A) */}
      <header className="bg-[#1E3A8A] text-white h-16 px-6 flex items-center justify-between shadow-md z-10 shrink-0 border-b border-blue-900/30">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none cursor-pointer"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="font-semibold text-lg tracking-wide text-white/95">GDPI Platform</span>
        </div>

        {/* Right side Take Snapshot & Upload buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTakeSnapshot}
            disabled={isCapturing}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 text-white rounded-lg text-sm font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Download high-resolution report snapshot"
          >
            {isCapturing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Capturing...</span>
              </>
            ) : (
              <>
                <Camera size={18} />
                <span>Take Snapshot</span>
              </>
            )}
          </button>

          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 text-white rounded-lg text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            <Upload size={18} />
            <span>Upload</span>
          </button>
        </div>
      </header>

      {/* Main Body (Sidebar + Content Outlet) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar: White background with black right border */}
        <aside
          className={`bg-white border-r border-black transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
            isSidebarOpen ? 'w-64' : 'w-0 border-r-0 overflow-hidden'
          }`}
        >
          <div className="p-4 w-64">
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#1E40AF]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/overall"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#1E40AF]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <BarChart2 size={20} />
                <span>Overall</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Main Content Area rendering Outlet */}
        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
