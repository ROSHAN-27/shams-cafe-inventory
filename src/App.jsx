import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Box, ClipboardList, History, Settings } from 'lucide-react'
import Dashboard from './components/Dashboard'
import ProductManager from './components/ProductManager'
import StockEntry from './components/StockEntry'
import HistoryView from './components/HistoryView'

function App() {
    const [activeTab, setActiveTab] = useState('dashboard')

    const renderView = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />
            case 'products': return <ProductManager />
            case 'stock': return <StockEntry />
            case 'history': return <HistoryView />
            default: return <Dashboard />
        }
    }

    return (
        <div className="app-container">
            <header className="main-header">
                <div className="container">
                    <div className="header-content">
                        <h1 className="logo">SHAMS CAFE</h1>
                        <nav className="desktop-nav">
                            <button
                                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                <LayoutDashboard size={20} /> Dashboard
                            </button>
                            <button
                                className={`nav-link ${activeTab === 'stock' ? 'active' : ''}`}
                                onClick={() => setActiveTab('stock')}
                            >
                                <ClipboardList size={20} /> Stock Entry
                            </button>
                            <button
                                className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                                onClick={() => setActiveTab('products')}
                            >
                                <Box size={20} /> Products
                            </button>
                            <button
                                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                <History size={20} /> History
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container main-content">
                {renderView()}
            </main>

            <nav className="mobile-nav">
                <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
                    <LayoutDashboard size={24} />
                    <span>Home</span>
                </button>
                <button onClick={() => setActiveTab('stock')} className={activeTab === 'stock' ? 'active' : ''}>
                    <ClipboardList size={24} />
                    <span>Stock</span>
                </button>
                <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>
                    <Box size={24} />
                    <span>Products</span>
                </button>
                <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>
                    <History size={24} />
                    <span>History</span>
                </button>
            </nav>

            <style jsx="true">{`
        .app-container {
          padding-bottom: 80px; /* Space for mobile nav */
        }
        .main-header {
          background: #000000;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
        }
        .logo {
          font-size: 1.5rem;
          color: #facc15; /* Vibrant Yellow */
          font-weight: 800;
        }
        .desktop-nav {
          display: flex;
          gap: 1rem;
        }
        .nav-link {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
        }
        .nav-link:hover {
          color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-link.active {
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
        }
        .main-content {
          padding-top: 2rem;
        }
        .mobile-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #000000;
          border-top: 1px solid var(--border);
          padding: 0.75rem;
          justify-content: space-around;
          z-index: 100;
        }
        .mobile-nav button {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          color: var(--text-muted);
          font-size: 0.75rem;
        }
        .mobile-nav button.active {
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-nav { display: flex; }
        }
      `}</style>
        </div>
    )
}

export default App
