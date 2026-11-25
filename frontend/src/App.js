import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import CreateBatch from './components/CreateBatch';
import DistributorPanel from './components/DistributorPanel';
import WarehousePanel from './components/WarehousePanel';
import PharmacyPanel from './components/PharmacyPanel';
import { connectWallet, getContract } from './utils/blockchain';
import AdminPanel from './components/AdminPanel';
import { getParticipantRole } from './utils/blockchain';
import ManufacturerPanel from './components/ManufacturerPanel';

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(0);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            const wallet = await connectWallet();
            setAccount(wallet);
            const c = await getContract();
            setContract(c);

            if (wallet) {
                const participantRole = await getParticipantRole(wallet);
                setRole(participantRole);
            }
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader">💊</div>
                <p>Connecting to Blockchain...</p>
            </div>
        );
    }

    return (
        <Router>
            <div className="app">
                <nav className="navbar">
                    <div className="navbar-brand">
                        <h1>💊MedTrack</h1>
                        <span>Blockchain Verified</span>
                    </div>
                    <div className="nav-links">
                        <Link to="/">Dashboard</Link>

                        {role === 1 && <Link to="/admin">Admin</Link>}
                        {role === 2 && <Link to="/create">Create Batch</Link>}
                        {role === 2 && <Link to="/manufacturer">Dispatch Medicine</Link>}
                        {role === 3 && <Link to="/distributor">Distributor</Link>}
                        {role === 4 && <Link to="/warehouse">Warehouse</Link>}
                        {role === 5 && <Link to="/pharmacy">Pharmacy</Link>}

                        <Link to="/scan">Scan QR</Link>

                        <span className="wallet-info">
                            {account
                                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                                : 'Connect Wallet'}
                        </span>
                    </div>
                </nav>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Dashboard account={account} />} />
                        <Route path="/scan" element={<QRScanner contract={contract} />} />
                        <Route path="/verify" element={<QRScanner contract={contract} />} />

                        {role === 1 && (
                            <Route path="/admin" element={<AdminPanel account={account} />} />
                        )}

                        {role === 2 && (
                            <Route path="/create" element={<CreateBatch />} />
                        )}

                        {role === 2 && (
                            <Route path="/manufacturer" element={<ManufacturerPanel />} />
                        )}

                        {role === 3 && (
                            <Route path="/distributor" element={<DistributorPanel />} />
                        )}

                        {role === 4 && (
                            <Route path="/warehouse" element={<WarehousePanel />} />
                        )}

                        {role === 5 && (
                            <Route path="/pharmacy" element={<PharmacyPanel />} />
                        )}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;