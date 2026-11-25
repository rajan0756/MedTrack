
import React, { useState } from 'react';
import { dispatchFromManufacturer } from '../utils/blockchain';

function ManufacturerPanel() {
    const [batchId, setBatchId] = useState('');
    const [distributorAddress, setDistributorAddress] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const isValidAddress = (address) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const handleDispatch = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!isValidAddress(distributorAddress)) {
            setMessage('Please enter a valid Distributor wallet address.');
            return;
        }

        try {
            setLoading(true);

            await dispatchFromManufacturer(
                batchId.trim(),
                distributorAddress.trim(),
                location.trim()
            );

            setMessage('Medicine successfully dispatched to Distributor.');

            setBatchId('');
            setDistributorAddress('');
            setLocation('');
        } catch (error) {
            setMessage(error.reason || error.message || 'Dispatch failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>🏭 Manufacturer Panel</h2>
            <p style={{ color: '#718096', marginBottom: '25px', fontSize: '0.95rem' }}>
                Dispatch manufactured medicine to a registered Distributor.
            </p>

            <form onSubmit={handleDispatch}>
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

                <div className="form-group">
                    <label>Distributor Wallet Address</label>
                    <input
                        type="text"
                        value={distributorAddress}
                        onChange={(e) => setDistributorAddress(e.target.value)}
                        placeholder="Enter Distributor wallet address"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Dispatch Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter dispatch location"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? '⏳ Processing...' : '📤 Dispatch Medicine'}
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

export default ManufacturerPanel;
