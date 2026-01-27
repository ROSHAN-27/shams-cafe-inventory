import React, { useState, useEffect } from 'react'
import { logService } from '../services/logService'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Printer } from 'lucide-react'

function HistoryView() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    const handlePrint = () => {
        window.print()
    }

    useEffect(() => {
        loadLogs()
    }, [selectedDate])

    async function loadLogs() {
        setLoading(true)
        try {
            const data = await logService.getDailyLogs(selectedDate)
            setLogs(data)
        } finally {
            setLoading(false)
        }
    }

    const totals = logs.reduce((acc, curr) => ({
        sales: acc.sales + (curr.sales_amount || 0),
        profit: acc.profit + (curr.profit || 0)
    }), { sales: 0, profit: 0 })

    return (
        <div className="history-view">
            <div className="flex justify-between items-center header-row" style={{ marginBottom: '2rem' }}>
                <h2>History</h2>
                <div className="flex gap-4">
                    <button className="btn btn-outline print-btn" onClick={handlePrint}>
                        <Printer size={20} /> Print Report
                    </button>
                    <div className="date-picker flex">
                        <CalendarIcon size={20} />
                        <input
                            type="date"
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="card totals-row grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div>
                    <small>Total Sales</small>
                    <h3>₹{totals.sales.toLocaleString()}</h3>
                </div>
                <div>
                    <small>Total Profit</small>
                    <h3>₹{totals.profit.toLocaleString()}</h3>
                </div>
            </div>

            <div className="history-list">
                {loading ? <p>Loading...</p> : logs.length === 0 ? <p className="text-center">No data for this date.</p> : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Sold</th>
                                <th>Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <strong>{log.products?.name}</strong>
                                        <br /><small>{log.products?.category}</small>
                                    </td>
                                    <td>{log.sold_qty}</td>
                                    <td>₹{log.profit?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx="true">{`
        .history-table { width: 100%; border-collapse: collapse; background: var(--card-bg); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border); }
        .history-table th { text-align: left; padding: 1rem; background: #1f2937; border-bottom: 1px solid var(--border); font-size: 0.875rem; color: var(--text-muted); }
        .history-table td { padding: 1rem; border-bottom: 1px solid var(--border); color: var(--text-main); }
        .text-center { text-align: center; color: var(--text-muted); padding: 2rem; }

        @media print {
            .mobile-nav, .desktop-nav, .print-btn, .date-picker, .main-header { display: none !important; }
            .history-view { padding: 0; margin: 0; }
            .card { border: 1px solid #ccc !important; box-shadow: none !important; color: black !important; background: white !important; }
            .history-table { border: 1px solid #ccc !important; color: black !important; }
            .history-table th { background: #eee !important; color: black !important; }
            .history-table td { color: black !important; }
            body { background: white !important; }
            h2, h3, h4, small, strong { color: black !important; }
            .app-container { padding: 0 !important; }
        }
      `}</style>
        </div>
    )
}

export default HistoryView
