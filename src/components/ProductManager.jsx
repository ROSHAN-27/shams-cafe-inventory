import React, { useState, useEffect } from 'react'
import { productService } from '../services/productService'
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react'

function ProductManager() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        cost_price: '',
        selling_price: '',
        box_number: ''
    })
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadProducts()
    }, [])

    async function loadProducts() {
        try {
            const data = await productService.getAllProducts()
            setProducts(data)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingId) {
                await productService.updateProduct(editingId, formData)
            } else {
                await productService.addProduct(formData)
            }
            setShowModal(false)
            setEditingId(null)
            setFormData({ name: '', category: '', cost_price: '', selling_price: '', box_number: '' })
            loadProducts()
        } catch (err) {
            alert('Error saving product: ' + err.message)
        }
    }

    const handleEdit = (product) => {
        setEditingId(product.id)
        setFormData({
            name: product.name,
            category: product.category || '',
            cost_price: product.cost_price,
            selling_price: product.selling_price,
            box_number: product.box_number || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id)
                loadProducts()
            } catch (err) {
                alert('Error deleting product')
            }
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.box_number?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="product-manager">
            <div className="flex justify-between" style={{ marginBottom: '2rem' }}>
                <h2>Inventory Items</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search items or box numbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid">
                {loading ? <p>Loading products...</p> : filteredProducts.map(product => (
                    <div key={product.id} className="card product-card">
                        <div className="product-info">
                            <h4>{product.name}</h4>
                            <span className="category-pill">{product.category}</span>
                            <div className="pricing">
                                <span>Cost: ₹{product.cost_price}</span>
                                <span>Sell: ₹{product.selling_price}</span>
                            </div>
                            <div className="box-info">Box: {product.box_number || 'N/A'}</div>
                        </div>
                        <div className="actions">
                            <button onClick={() => handleEdit(product)} className="btn-icon"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(product.id)} className="btn-icon delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setShowModal(false)} className="btn-icon"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Product Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>
                            <div className="flex">
                                <div className="input-group">
                                    <label>Cost Price (Per unit)</label>
                                    <input type="number" step="0.01" required value={formData.cost_price} onChange={e => setFormData({ ...formData, cost_price: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Selling Price (Per unit)</label>
                                    <input type="number" step="0.01" required value={formData.selling_price} onChange={e => setFormData({ ...formData, selling_price: e.target.value })} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Box Number</label>
                                <input value={formData.box_number} onChange={e => setFormData({ ...formData, box_number: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1rem' }}>
                                {editingId ? 'Update Product' : 'Save Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx="true">{`
        .product-manager { max-width: 900px; margin: 0 auto; }
        .search-bar { position: relative; margin-bottom: 2rem; }
        .search-bar svg { position: absolute; left: 1rem; top: 1rem; color: var(--text-muted); }
        .search-bar input { padding-left: 3rem; }
        .product-card { display: flex; justify-content: space-between; align-items: flex-start; }
        .category-pill { display: inline-block; font-size: 0.75rem; background: #1f2937; padding: 0.25rem 0.5rem; border-radius: 4px; margin: 0.5rem 0; color: var(--text-muted); }
        .pricing { display: flex; gap: 1rem; font-size: 0.875rem; font-weight: 600; }
        .pricing span:first-child { color: var(--text-muted); }
        .box-info { margin-top: 0.5rem; font-size: 0.875rem; color: var(--primary); font-weight: 500; }
        .btn-icon { background: none; border: none; padding: 0.5rem; cursor: pointer; color: var(--text-muted); }
        .btn-icon:hover { color: var(--primary); }
        .btn-icon.delete:hover { color: var(--danger); }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; backdrop-filter: blur(4px); }
        .modal-content { width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; background: var(--card-bg); border: 1px solid var(--border); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .w-full { width: 100%; }
      `}</style>
        </div>
    )
}

export default ProductManager
