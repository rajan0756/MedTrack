
import React, { useState } from 'react';
import {
    getAdmin,
    getParticipantRole,
    registerParticipant,
    revokeParticipant
} from '../utils/blockchain';

const roleNames = {
    0: 'Not Registered',
    1: 'Admin',
    2: 'Manufacturer',
    3: 'Distributor',
    4: 'Warehouse',
    5: 'Pharmacy'
};

const ethersAddressIsValid = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

function AdminPanel({ account }) {
    const [walletAddress, setWalletAddress] = useState('');
    const [role, setRole] = useState('2');
    const [lookupAddress, setLookupAddress] = useState('');
    const [lookupResult, setLookupResult] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const checkAdmin = async () => {
        const adminAddress = await getAdmin();

        if (!account || adminAddress.toLowerCase() !== account.toLowerCase()) {
            throw new Error('Access denied. Connect the Admin wallet.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!ethersAddressIsValid(walletAddress)) {
            setMessage('Please enter a valid wallet address.');
            return;
        }

        try {
            setLoading(true);
            await checkAdmin();
            await registerParticipant(walletAddress, Number(role));

            setMessage(`${roleNames[role]} registered successfully.`);
            setWalletAddress('');
        } catch (error) {
            setMessage(error.reason || error.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleLookup = async (e) => {
        e.preventDefault();
        setMessage('');
        setLookupResult('');

        if (!ethersAddressIsValid(lookupAddress)) {
            setMessage('Please enter a valid wallet address.');
            return;
        }

        try {
            setLoading(true);
            const participantRole = await getParticipantRole(lookupAddress);
            setLookupResult(roleNames[participantRole] || 'Unknown Role');
        } catch (error) {
            setMessage(error.reason || error.message || 'Could not fetch role.');
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async () => {
        setMessage('');
        setLookupResult('');

        if (!ethersAddressIsValid(lookupAddress)) {
            setMessage('Enter a valid wallet address to revoke.');
            return;
        }

        try {
            setLoading(true);
            await checkAdmin();
            await revokeParticipant(lookupAddress);

            setMessage('Participant access revoked successfully.');
            setLookupResult('Not Registered');
        } catch (error) {
            setMessage(error.reason || error.message || 'Revocation failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>🛡️ Admin Panel</h2>
            <p style={{ color: '#718096', marginBottom: '25px', fontSize: '0.95rem' }}>
                Manage MedTrack supply-chain participants and their access.
            </p>

            <form onSubmit={handleRegister}>
                <h3>Register Participant</h3>

                <div className="form-group">
                    <label>Wallet Address</label>
                    <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="Enter participant wallet address"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Assign Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="2">Manufacturer</option>
                        <option value="3">Distributor</option>
                        <option value="4">Warehouse</option>
                        <option value="5">Pharmacy</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? '⏳ Processing...' : '➕ Register Participant'}
                </button>
            </form>

            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

            <h3>Manage Participant</h3>

            <form onSubmit={handleLookup}>
                <div className="form-group">
                    <label>Wallet Address</label>
                    <input
                        type="text"
                        value={lookupAddress}
                        onChange={(e) => setLookupAddress(e.target.value)}
                        placeholder="Enter wallet address"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? '⏳ Processing...' : '🔍 Check Role'}
                </button>
            </form>

            {lookupResult && (
                <div className="success-message" style={{ marginTop: '20px' }}>
                    <strong>Current Role:</strong> {lookupResult}
                </div>
            )}

            <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: '15px' }}
                onClick={handleRevoke}
                disabled={loading || !lookupAddress}
            >
                {loading ? '⏳ Processing...' : '🚫 Revoke Access'}
            </button>

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

export default AdminPanel;
