
import React, { useState } from 'react';
import {
    receiveAtWarehouse,
    dispatchFromWarehouse
} from '../utils/blockchain';

function WarehousePanel() {
    const [mode, setMode] = useState('receive');
    const [batchId, setBatchId] = useState('');
    const [location, setLocation] = useState('');
    const [pharmacyAddress, setPharmacyAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const isValidAddress = (address) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const handleReceive = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            setLoading(true);
            await receiveAtWarehouse(batchId.trim(), location.trim());

            setMessage('Medicine received successfully at Warehouse.');
            setBatchId('');
            setLocation('');
        } catch (error) {
            setMessage(error.reason || error.message || 'Receiving failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDispatch = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!isValidAddress(pharmacyAddress)) {
            setMessage('Please enter a valid Pharmacy wallet address.');
            return;
        }

        try {
            setLoading(true);

            await dispatchFromWarehouse(
                batchId.trim(),
                pharmacyAddress.trim(),
                location.trim()
            );

            setMessage('Medicine successfully dispatched to Pharmacy.');
            setBatchId('');
            setPharmacyAddress('');
            setLocation('');
        } catch (error) {
            setMessage(error.reason || error.message || 'Dispatch failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>🏬 Warehouse Panel</h2>
            <p style={{ color: '#718096', marginBottom: '25px', fontSize: '0.95rem' }}>
                Receive medicine from Distributor and dispatch it to Pharmacy.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', flexWrap: 'wrap' }}>
                <button
                    type="button"
                    className={mode === 'receive' ? 'btn btn-primary' : 'btn btn-outline'}
                    onClick={() => {
                        setMode('receive');
                        setMessage('');
                    }}
                >
                    📥 Receive
                </button>

                <button
                    type="button"
                    className={mode === 'dispatch' ? 'btn btn-primary' : 'btn btn-outline'}
                    onClick={() => {
                        setMode('dispatch');
                        setMessage('');
                    }}
                >
                    📤 Dispatch
                </button>
            </div>

            <form onSubmit={mode === 'receive' ? handleReceive : handleDispatch}>
                <div className="form-group">
                    <label>Medicine Batch ID</label>
                    <input
                        type="text"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        placeholder="Enter medicine batch ID"
                        required
                    />
                </div>

                {mode === 'dispatch' && (
                    <div className="form-group">
                        <label>Pharmacy Wallet Address</label>
                        <input
                            type="text"
                            value={pharmacyAddress}
                            onChange={(e) => setPharmacyAddress(e.target.value)}
                            placeholder="Enter registered Pharmacy address"
                            required
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>{mode === 'receive' ? 'Receiving Location' : 'Dispatch Location'}</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter warehouse location"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading
                        ? '⏳ Processing...'
                        : mode === 'receive'
                            ? '📥 Confirm Receipt'
                            : '📤 Dispatch to Pharmacy'}
                </button>
            </form>

            {message && (
                <div className={
                    message.includes('successfully')
                        ? 'success-message'
                        : 'error-message'
                } style={{ marginTop: '20px' }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default WarehousePanel;
