import React, { useState, useEffect } from 'react'
import { logService } from '../services/logService'
import { TrendingUp, DollarSign, Package, AlertCircle } from 'lucide-react'

function Dashboard() {
    const [summary, setSummary] = useState({ totalSales: 0, totalProfit: 0 })
    const [stockData, setStockData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            try {
                const [summaryData, logs] = await Promise.all([
                    logService.getTodaySummary(),
                    logService.getDailyLogs(new Date())
                ])
                setSummary(summaryData)
                setStockData(logs)
            } catch (err) {
                console.error('Error loading dashboard data:', err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) return <div className="loading">Loading dashboard...</div>

    return (
        <div className="dashboard-grid grid">
            <div className="card stat-card">
                <div className="stat-icon sales">
                    <DollarSign size={24} />
                </div>
                <div className="stat-info">
                    <span className="stat-label">Today's Sales</span>
                    <h2 className="stat-value">₹{summary.totalSales.toLocaleString()}</h2>
                </div>
            </div>

            <div className="card stat-card">
                <div className="stat-icon profit">
                    <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                    <span className="stat-label">Today's Profit</span>
                    <h2 className="stat-value">₹{summary.totalProfit.toLocaleString()}</h2>
                </div>
            </div>

            <div className="card wide-card">
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h3>Stock Overview</h3>
                    <Package size={20} color="var(--primary)" />
                </div>
                <div className="stock-table-container">
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Box</th>
                                <th>Opening</th>
                                <th>Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.length === 0 ? (
                                <tr><td colSpan="4" className="text-center">No stock data for today yet.</td></tr>
                            ) : stockData.map(log => (
                                <tr key={log.id}>
                                    <td>{log.products?.name}</td>
                                    <td><span className="box-pill">{log.products?.box_number || 'N/A'}</span></td>
                                    <td>{log.opening_stock}</td>
                                    <td>
                                        <span className={log.remaining_stock === 0 ? 'out-of-stock' : ''}>
                                            {log.remaining_stock}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card wide-card">
                <h3>Daily Reminder</h3>
                <p>Manage your inventory every morning and evening to see accurate sales data.</p>
                <div className="quick-actions flex" style={{ marginTop: '1rem' }}>
                    <div className="info-badge">
                        <AlertCircle size={16} />
                        <span>Update closing stock every night for accurate profit!</span>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
        .dashboard-grid {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon.sales { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
        .stat-icon.profit { background: rgba(22, 163, 74, 0.1); color: #16a34a; }
        .stat-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
        .stat-value { font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
        .wide-card { grid-column: 1 / -1; }
        
        .stock-table-container { overflow-x: auto; }
        .stock-table { width: 100%; border-collapse: collapse; text-align: left; }
        .stock-table th { padding: 0.75rem; border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 0.875rem; }
        .stock-table td { padding: 0.75rem; border-bottom: 1px solid var(--border); }
        .box-pill { background: #1f2937; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; color: var(--primary); font-weight: 600; }
        .out-of-stock { color: var(--danger); font-weight: 700; }
        
        .info-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          padding: 0.5rem 1rem;
          border-radius: 99px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
      `}</style>
        </div>
    )
}

export default Dashboard
