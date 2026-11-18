import React, { useState } from 'react';
import { receiveAtPharmacy, sellToPatient } from '../utils/blockchain';

function PharmacyPanel() {
    const [batchId, setBatchId] = useState('');
    const [location, setLocation] = useState('');
    const [patientName, setPatientName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState('receive');

    const handleReceive = async () => {
        if (!batchId || !location) {
            setMessage('❌ Please fill all fields');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            await receiveAtPharmacy(batchId, location);
            setMessage('✅ Medicine received at pharmacy!');
            setBatchId('');
            setLocation('');
        } catch (err) {
            setMessage('❌ Error: ' + err.message);
        }
        setLoading(false);
    };

    const handleSell = async () => {
        if (!batchId || !patientName) {
            setMessage('❌ Please fill all fields');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            await sellToPatient(batchId, patientName);
            setMessage('✅ Medicine sold to patient!');
            setBatchId('');
            setPatientName('');
        } catch (err) {
            setMessage('❌ Error: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h2>💊 Pharmacy Panel</h2>
            <p style={{ color: '#718096', marginBottom: '25px', fontSize: '0.95rem' }}>
                Receive stock and sell to patients
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', flexWrap: 'wrap' }}>
                <button
                    className={mode === 'receive' ? 'btn btn-primary' : 'btn btn-outline'}
                    onClick={() => setMode('receive')}
                >
                    📦 Receive Stock
                </button>
                <button
                    className={mode === 'sell' ? 'btn btn-primary' : 'btn btn-outline'}
                    onClick={() => setMode('sell')}
                >
                    💊 Sell to Patient
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
                        <input type="text" placeholder="e.g., Delhi Pharmacy"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={handleReceive} disabled={loading}>
                        {loading ? '⏳ Processing...' : '📦 Receive Stock'}
                    </button>
                </>
            ) : (
                <>
                    <div className="form-group">
                        <label>Patient Name</label>
                        <input type="text" placeholder="e.g., Amit Kumar"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)} />
                    </div>
                    <button className="btn btn-success" onClick={handleSell} disabled={loading}>
                        {loading ? '⏳ Processing...' : '💊 Sell to Patient'}
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

export default PharmacyPanel;