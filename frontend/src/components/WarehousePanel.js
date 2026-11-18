import React, { useState } from 'react';
import { receiveAtWarehouse } from '../utils/blockchain';

function WarehousePanel() {
    const [batchId, setBatchId] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleReceive = async () => {
        if (!batchId || !location) {
            setMessage('❌ Please fill all fields');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            await receiveAtWarehouse(batchId, location);
            setMessage('✅ Medicine received at warehouse!');
            setBatchId('');
            setLocation('');
        } catch (err) {
            setMessage('❌ Error: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h2>📦 Warehouse Panel</h2>
            <p style={{ color: '#718096', marginBottom: '25px', fontSize: '0.95rem' }}>
                Receive incoming medicine shipments
            </p>

            <div className="form-group">
                <label>Batch ID</label>
                <input type="text" placeholder="Enter batch ID from QR"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Location</label>
                <input type="text" placeholder="e.g., Mumbai Warehouse"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleReceive} disabled={loading}>
                {loading ? '⏳ Processing...' : '📦 Receive Shipment'}
            </button>

            {message && (
                <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default WarehousePanel;