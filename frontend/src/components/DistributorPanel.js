import React, { useState } from 'react';
import { receiveAtDistributor, dispatchFromDistributor } from '../utils/blockchain';

function DistributorPanel() {
    const [mode, setMode] = useState('receive');
    const [batchId, setBatchId] = useState('');
    const [location, setLocation] = useState('');
    const [warehouseAddress, setWarehouseAddress] = useState('');
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
            await receiveAtDistributor(batchId, location);
            setMessage('✅ Medicine received at distributor!');
            setBatchId('');
            setLocation('');
        } catch (err) {
            setMessage('❌ Error: ' + err.message);
        }
        setLoading(false);
    };

    const handleDispatch = async () => {
        if (!batchId || !warehouseAddress || !location) {
            setMessage('❌ Please fill all fields');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            await dispatchFromDistributor(batchId, warehouseAddress, location);
            setMessage('✅ Medicine dispatched to warehouse!');
            setBatchId('');
            setWarehouseAddress('');
            setLocation('');
        } catch (err) {
            setMessage('❌ Error: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h2>🚚 Distributor Panel</h2>
            <p style={{ color: '#718096', marginBottom: '25px', fontSize: '0.95rem' }}>
                Receive from manufacturer and dispatch to warehouse
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', flexWrap: 'wrap' }}>
                <button
                    className={mode === 'receive' ? 'btn btn-primary' : 'btn btn-outline'}
                    onClick={() => setMode('receive')}
                >
                    📥 Receive
                </button>
                <button
                    className={mode === 'dispatch' ? 'btn btn-primary' : 'btn btn-outline'}
                    onClick={() => setMode('dispatch')}
                >
                    📤 Dispatch
                </button>
            </div>

            <div className="form-group">
                <label>Batch ID</label>
                <input type="text" placeholder="Enter batch ID"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)} />
            </div>

            {mode === 'receive' ? (
                <>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" placeholder="e.g., Mumbai Distribution Center"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={handleReceive} disabled={loading}>
                        {loading ? '⏳ Processing...' : '📥 Receive Stock'}
                    </button>
                </>
            ) : (
                <>
                    <div className="form-group">
                        <label>Warehouse Address</label>
                        <input type="text" placeholder="0x... (Warehouse wallet)"
                            value={warehouseAddress}
                            onChange={(e) => setWarehouseAddress(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Dispatch Location</label>
                        <input type="text" placeholder="e.g., Mumbai Warehouse"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <button className="btn btn-success" onClick={handleDispatch} disabled={loading}>
                        {loading ? '⏳ Processing...' : '📤 Dispatch to Warehouse'}
                    </button>
                </>
            )}

            {message && (
                <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default DistributorPanel;