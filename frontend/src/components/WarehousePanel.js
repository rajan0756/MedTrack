
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
        <div className="container">
            <div className="card">
                <h2>Warehouse Panel</h2>
                <p>Manage medicine received and dispatched by the Warehouse.</p>

                <div>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('receive');
                            setMessage('');
                        }}
                    >
                        Receive Stock
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode('dispatch');
                            setMessage('');
                        }}
                    >
                        Dispatch to Pharmacy
                    </button>
                </div>

                <form onSubmit={mode === 'receive' ? handleReceive : handleDispatch}>
                    <label>Medicine Batch ID</label>
                    <input
                        type="text"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        placeholder="Enter medicine batch ID"
                        required
                    />

                    {mode === 'dispatch' && (
                        <>
                            <label>Pharmacy Wallet Address</label>
                            <input
                                type="text"
                                value={pharmacyAddress}
                                onChange={(e) => setPharmacyAddress(e.target.value)}
                                placeholder="Enter registered Pharmacy address"
                                required
                            />
                        </>
                    )}

                    <label>Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter warehouse location"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading
                            ? 'Processing...'
                            : mode === 'receive'
                                ? 'Confirm Receipt'
                                : 'Dispatch Medicine'}
                    </button>
                </form>

                {message && (
                    <div className="message">
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WarehousePanel;
