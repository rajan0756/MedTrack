
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

        if (
            !account ||
            adminAddress.toLowerCase() !== account.toLowerCase()
        ) {
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

            setLookupResult(
                roleNames[participantRole] || 'Unknown Role'
            );
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
        <div className="container">
            <div className="card">
                <h2>Admin Panel</h2>
                <p>Manage MedTrack supply-chain participants.</p>

                <form onSubmit={handleRegister}>
                    <h3>Register Participant</h3>

                    <label>Wallet Address</label>
                    <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="Enter participant wallet address"
                        required
                    />

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

                    <button type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Register Participant'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3>Manage Participant</h3>

                <form onSubmit={handleLookup}>
                    <label>Wallet Address</label>
                    <input
                        type="text"
                        value={lookupAddress}
                        onChange={(e) => setLookupAddress(e.target.value)}
                        placeholder="Enter wallet address"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        Check Role
                    </button>
                </form>

                {lookupResult && (
                    <p>
                        <strong>Current Role:</strong> {lookupResult}
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleRevoke}
                    disabled={loading || !lookupAddress}
                >
                    Revoke Access
                </button>
            </div>

            {message && (
                <div className="card">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
