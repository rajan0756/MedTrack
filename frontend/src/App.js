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

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            const wallet = await connectWallet();
            setAccount(wallet);
            const c = await getContract();
            setContract(c);
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
                        <Link to="/create">Create</Link>
                        <Link to="/distributor">Distributor</Link>
                        <Link to="/warehouse">Warehouse</Link>
                        <Link to="/pharmacy">Pharmacy</Link>
                        <Link to="/scan">Scan QR</Link>
                        <span className="wallet-info">
                            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
                        </span>
                    </div>
                </nav>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Dashboard account={account} />} />
                        <Route path="/create" element={<CreateBatch />} />
                        <Route path="/distributor" element={<DistributorPanel />} />
                        <Route path="/warehouse" element={<WarehousePanel />} />
                        <Route path="/pharmacy" element={<PharmacyPanel />} />
                        <Route path="/scan" element={<QRScanner contract={contract} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;