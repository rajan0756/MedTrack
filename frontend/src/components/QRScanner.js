import React, { useState } from 'react';
import { QrReader } from '@fjhonda/react-qr-reader';
import { verifyMedicine, getHistory } from '../utils/blockchain';

function QRScanner({ contract }) {
    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);

    const handleScan = async (data) => {
        if (data && data.text) {
            setScanResult(data.text);
            setLoading(true);
            setError('');

            try {
                const batchId = extractBatchId(data.text);

                if (batchId) {
                    const verification = await verifyMedicine(batchId);
                    setResult({
                        isValid: verification[0],
                        batchId: verification[1],
                        name: verification[2],
                        manufacturer: verification[3],
                        status: verification[4],
                        expiryDate: verification[5]
                    });

                    const historyData = await getHistory(batchId);
                    setHistory(historyData);
                    setLoading(false);
                } else {
                    setError('Invalid QR code. No batch ID found.');
                    setLoading(false);
                }
            } catch (err) {
                setError('Error verifying medicine: ' + err.message);
                setLoading(false);
            }
        }
    };

    const extractBatchId = (qrData) => {
        if (qrData.includes('batch=')) {
            const params = new URLSearchParams(qrData.split('?')[1]);
            return params.get('batch');
        }
        if (qrData.length > 5 && qrData.includes('-')) {
            return qrData;
        }
        return null;
    };

    const handleError = (err) => {
        console.error('QR Scanner Error:', err);
    };

    const formatDate = (timestamp) => {
        return new Date(Number(timestamp) * 1000).toLocaleString();
    };

    return (
        <div className="scanner-container">
            <h2 style={{
                color: 'white',
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.8px',
                marginBottom: '10px'
            }}>
                📸 Scan QR Code
            </h2>
            <p style={{
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '25px',
                fontSize: '0.95rem'
            }}>
                Scan medicine QR code to verify authenticity
            </p>

            <div className="scanner-box">
                <QrReader
                    onResult={handleScan}
                    onError={handleError}
                    style={{ width: '100%' }}
                    constraints={{ facingMode: 'environment' }}
                />
            </div>

            {loading && (
                <div style={{
                    marginTop: '20px',
                    color: '#00d4ff',
                    fontWeight: 600,
                    fontSize: '1.1rem'
                }}>
                    ⏳ Verifying medicine on blockchain...
                </div>
            )}

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            {result && !loading && (
                <div className={result.isValid ? 'result-authentic' : 'result-fake'}
                    style={{ textAlign: 'left' }}>
                    <h3>{result.isValid ? '✅ AUTHENTIC MEDICINE' : '❌ COUNTERFEIT DETECTED'}</h3>
                    <p><strong>Batch ID:</strong> {result.batchId}</p>
                    <p><strong>Medicine:</strong> {result.name}</p>
                    <p><strong>Manufacturer:</strong> {result.manufacturer}</p>
                    <p><strong>Status:</strong> {result.status}</p>
                    <p><strong>Expiry:</strong> {formatDate(result.expiryDate)}</p>
                    <p><strong>History Entries:</strong> {history.length}</p>
                </div>
            )}

            {history.length > 0 && (
                <div className="card" style={{ marginTop: '25px', textAlign: 'left' }}>
                    <h4>📦 Supply Chain History</h4>
                    <div className="timeline">
                        {history.map((entry, index) => (
                            <div key={index} className="timeline-item">
                                <div className="action">{entry.action}</div>
                                <div className="details">📍 {entry.location}</div>
                                <div className="time">📅 {formatDate(entry.timestamp)}</div>
                                {entry.notes && (
                                    <div className="details">📝 {entry.notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default QRScanner;