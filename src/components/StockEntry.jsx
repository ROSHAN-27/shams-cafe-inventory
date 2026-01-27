import React, { useState, useEffect, useCallback } from 'react'
import { productService } from '../services/productService'
import { logService } from '../services/logService'
import { format } from 'date-fns'
import { Sun, Moon, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'

function StockEntry() {
    const [products, setProducts] = useState([])
    const [logs, setLogs] = useState({})
    const [mode, setMode] = useState('morning')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const today = format(new Date(), 'yyyy-MM-dd')

    const loadData = useCallback(async () => {
        setLoading(true)
        try {
            const [allProducts, existingLogs] = await Promise.all([
                productService.getAllProducts(),
                logService.getDailyLogs(new Date())
            ])

            setProducts(allProducts)

            const logMap = {}
            allProducts.forEach(p => {
                const found = existingLogs.find(l => l.product_id === p.id)
                logMap[p.id] = found ? {
                    ...found,
                    opening_stock: found.opening_stock?.toString() ?? '',
                    remaining_stock: found.remaining_stock?.toString() ?? ''
                } : {
                    product_id: p.id,
                    date: today,
                    opening_stock: '',
                    remaining_stock: ''
                }
            })
            setLogs(logMap)
        } finally {
            setLoading(false)
        }
    }, [today])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleInputChange = (productId, field, value) => {
        setLogs(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value }
        }))
    }

    const handleSaveAll = async () => {
        if (saving) return
        setSaving(true)

        try {
            const entriesToSave = products.map(p => {
                const log = logs[p.id] || {}
                const opening = parseFloat(log.opening_stock) || 0
                const remaining = parseFloat(log.remaining_stock) || 0

                const sold = Math.max(0, opening - remaining)
                const salesAmount = sold * (p.selling_price || 0)
                const profit = sold * ((p.selling_price || 0) - (p.cost_price || 0))

                // IMPORTANT: We OMIT the 'id' field ENTIRELY.
                // Supabase will use the UNIQUE(product_id, date) constraint to match existing rows.
                // This avoids the 'null value in column id' error.
                return {
                    product_id: p.id,
                    date: today,
                    opening_stock: opening,
                    remaining_stock: remaining,
                    sales_amount: salesAmount,
                    profit: profit
                }
            })

            await logService.bulkUpsertDailyLogs(entriesToSave)
            alert(`Success! Saved ${entriesToSave.length} items.`)
            await loadData()
        } catch (err) {
            alert('Save Error: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="loading">Connecting to database...</div>

    return (
        <div className="stock-entry">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2>Stock Entry</h2>
                    <small style={{ color: 'var(--text-muted)' }}>Date: {today}</small>
                </div>
                <button className="btn btn-outline" onClick={loadData} disabled={loading}><RefreshCw size={18} /></button>
            </div>

            <div className="card mode-selector">
                <button className={`mode-btn ${mode === 'morning' ? 'active morning' : ''}`} onClick={() => setMode('morning')}>
                    <Sun size={24} />
                    <div><strong>Morning</strong><span>Opening Qty</span></div>
                </button>
                <button className={`mode-btn ${mode === 'evening' ? 'active evening' : ''}`} onClick={() => setMode('evening')}>
                    <Moon size={24} />
                    <div><strong>Evening</strong><span>Remaining Qty</span></div>
                </button>
            </div>

            <div className="stock-list">
                {products.length === 0 ? (
                    <div className="card text-center" style={{ padding: '2rem' }}>No products found. Add them in the "Products" tab.</div>
                ) : products.map(product => (
                    <div key={product.id} className="card entry-card">
                        <div className="product-details">
                            <h4>{product.name}</h4>
                            <span className="box-label">BOX {product.box_number || 'NA'}</span>
                        </div>

                        <div className="input-section">
                            {mode === 'morning' ? (
                                <div className="input-box">
                                    <label>Opening Qty</label>
                                    <input
                                        type="number"
                                        value={logs[product.id]?.opening_stock ?? ''}
                                        onChange={(e) => handleInputChange(product.id, 'opening_stock', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            ) : (
                                <div className="evening-box">
                                    <div className="morning-val"><small>Opening: {logs[product.id]?.opening_stock || 0}</small></div>
                                    <div className="input-box">
                                        <label>Remaining Qty</label>
                                        <input
                                            type="number"
                                            value={logs[product.id]?.remaining_stock ?? ''}
                                            onChange={(e) => handleInputChange(product.id, 'remaining_stock', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="footer-action">
                <button className="btn btn-primary big-save" onClick={handleSaveAll} disabled={saving || products.length === 0}>
                    {saving ? 'Saving...' : <><CheckCircle size={22} /> Save All Entries</>}
                </button>
            </div>

            <style jsx="true">{`
        .mb-6 { margin-bottom: 2rem; }
        .mode-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; padding: 0.5rem; }
        .mode-btn { border: none; background: transparent; display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; cursor: pointer; text-align: left; color: var(--text-muted); }
        .mode-btn.active.morning { background: rgba(250, 204, 21, 0.1); color: #facc15; }
        .mode-btn.active.evening { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .stock-list { margin-bottom: 8rem; }
        .entry-card { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 1.25rem 1.5rem; background: #000; border: 1px solid var(--border); }
        .box-label { font-size: 0.7rem; color: #facc15; background: rgba(250,204,21,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid var(--primary); }
        .input-box input { width: 100px; text-align: center; height: 45px; font-size: 1.1rem; }
        .evening-box { display: flex; align-items: center; gap: 1.5rem; }
        .morning-val { background: #111; padding: 0.5rem 0.8rem; border-radius: 8px; border: 1px dotted var(--border); }
        .footer-action { position: fixed; bottom: 85px; left: 0; right: 0; padding: 1rem; display: flex; justify-content: center; z-index: 100; pointer-events: none; }
        .big-save { pointer-events: auto; width: 100%; max-width: 400px; height: 55px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        @media (max-width: 768px) {
          .entry-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .input-section, .evening-box { width: 100%; justify-content: space-between; }
        }
      `}</style>
        </div>
    )
}

export default StockEntry
