import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { createMedicine } from '../utils/blockchain';

function CreateBatch() {
    const [form, setForm] = useState({
        batchId: '',
        name: '',
        manufacturer: '',
        expiryDate: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [createdBatch, setCreatedBatch] = useState(null);

    // AUTO-GENERATE: Generate a new ID as soon as the page loads
    useEffect(() => {
        generateNewId();
    }, []);

    // AUTO-GENERATE: The function that creates the unique ID in MED-YYYY-XXXX format
    const generateNewId = () => {
        const year = new Date().getFullYear(); // Gets 2026
        // Generates a 4-digit number like 0042 or 8491
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const newId = `MED-${year}-${randomNum}`;
        setForm((prevForm) => ({ ...prevForm, batchId: newId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setQrCodeUrl('');
        setCreatedBatch(null);

        try {
            await createMedicine(
                form.batchId,
                form.name,
                form.manufacturer,
                new Date(form.expiryDate),
                parseInt(form.quantity)
            );

            const qrData = `${window.location.origin}/verify?batch=${encodeURIComponent(form.batchId)}`;

            QRCode.toDataURL(qrData, {
                width: 400,
                margin: 2,
                color: { dark: '#1a1a2e', light: '#ffffff' }
            }, (err, url) => {
                if (err) {
                    setMessage('✅ Batch created! But QR generation failed.');
                } else {
                    setQrCodeUrl(url);
                    setCreatedBatch({
                        batchId: form.batchId,
                        name: form.name,
                        manufacturer: form.manufacturer,
                        expiryDate: form.expiryDate,
                        quantity: form.quantity
                    });
                    setMessage('✅ Medicine batch created and QR code generated!');
                }
            });

            // Reset form fields but auto-generate a NEW Batch ID
            setForm({
                batchId: '',
                name: '',
                manufacturer: '',
                expiryDate: '',
                quantity: ''
            });
            // Generate new ID for the next batch
            setTimeout(() => generateNewId(), 100);

        } catch (err) {
            setMessage('❌ Error: ' + err.message);
        }
        setLoading(false);
    };

    const handleDownloadQR = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `MedTrack_QR_${createdBatch.batchId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrintQR = () => {
        if (!qrCodeUrl) return;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>MedTrack QR - ${createdBatch.batchId}</title>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; text-align: center; padding: 50px; background: #f0f4f8; }
                        .qr-container { border: 3px solid #667eea; padding: 30px; display: inline-block; border-radius: 20px; background: white; box-shadow: 0 20px 60px rgba(102,126,234,0.3); }
                        h2 { color: #667eea; margin-bottom: 8px; }
                        .details { margin: 20px 0; text-align: left; padding: 15px; background: #f7fafc; border-radius: 12px; }
                        .details p { margin: 6px 0; color: #2d3748; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <h2>💊 MedTrack</h2>
                        <p style="color:#718096; margin-bottom: 20px;">Scan to Verify Authenticity</p>
                        <img src="${qrCodeUrl}" width="280" />
                        <div class="details">
                            <p><strong>Batch ID:</strong> ${createdBatch.batchId}</p>
                            <p><strong>Medicine:</strong> ${createdBatch.name}</p>
                            <p><strong>Manufacturer:</strong> ${createdBatch.manufacturer}</p>
                            <p><strong>Expiry:</strong> ${createdBatch.expiryDate}</p>
                            <p><strong>Quantity:</strong> ${createdBatch.quantity}</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleCreateAnother = () => {
        setQrCodeUrl('');
        setCreatedBatch(null);
        setMessage('');
        generateNewId(); // Generate a fresh ID
    };

    return (
        <div className="card">
            <h2>🏭 Create Medicine Batch</h2>
            <p style={{ color: '#718096', marginBottom: '25px', fontSize: '0.95rem' }}>
                Manufacturer: Register new medicine on the blockchain
            </p>

            {!qrCodeUrl && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Batch ID (Auto-Generated)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                value={form.batchId}
                                readOnly
                                style={{ 
                                    flex: 1,
                                    backgroundColor: '#e0e0e0', 
                                    cursor: 'not-allowed',
                                    color: '#4a5568',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px'
                                }}
                            />
                            <button 
                                type="button"
                                onClick={generateNewId}
                                style={{
                                    padding: '0 18px',
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                🔄 Regenerate
                            </button>
                        </div>
                        <small style={{ color: '#a0aec0', fontSize: '0.8rem', marginTop: '6px', display: 'block' }}>
                            Format: MED-YYYY-XXXX (auto-generated to prevent typos)
                        </small>
                    </div>
                    <div className="form-group">
                        <label>Medicine Name</label>
                        <input type="text" placeholder="e.g., Paracetamol 500mg"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" placeholder="e.g., PharmaCorp"
                            value={form.manufacturer}
                            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                            required />
                    </div>
                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="date" value={form.expiryDate}
                            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                            required />
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input type="number" placeholder="e.g., 1000"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? '⏳ Creating...' : '➕ Create Batch & Generate QR'}
                    </button>
                </form>
            )}

            {message && (
                <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
                    {message}
                </div>
            )}

            {qrCodeUrl && createdBatch && (
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '10px' }}>📸 QR Code Generated!</h3>
                    <p style={{ color: '#718096', marginBottom: '25px' }}>
                        Print and stick this QR on the medicine box
                    </p>

                    <div style={{
                        display: 'inline-block',
                        padding: '25px',
                        border: '3px solid #667eea',
                        borderRadius: '20px',
                        background: 'white',
                        marginBottom: '25px',
                        boxShadow: '0 20px 60px rgba(102,126,234,0.25)'
                    }}>
                        <h3 style={{ color: '#667eea', marginBottom: '8px', fontSize: '1.4rem' }}>
                            💊 MedTrack
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '18px' }}>
                            Scan to Verify Authenticity
                        </p>

                        <img src={qrCodeUrl} alt="QR Code"
                            style={{ width: '260px', height: '260px', borderRadius: '8px' }} />

                        <div style={{
                            marginTop: '20px',
                            textAlign: 'left',
                            fontSize: '0.9rem',
                            borderTop: '2px solid #e2e8f0',
                            paddingTop: '18px'
                        }}>
                            <p style={{ margin: '6px 0' }}><strong>Batch:</strong> {createdBatch.batchId}</p>
                            <p style={{ margin: '6px 0' }}><strong>Medicine:</strong> {createdBatch.name}</p>
                            <p style={{ margin: '6px 0' }}><strong>Expiry:</strong> {createdBatch.expiryDate}</p>
                            <p style={{ margin: '6px 0' }}><strong>Qty:</strong> {createdBatch.quantity}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={handleDownloadQR}>
                            📥 Download QR
                        </button>
                        <button className="btn btn-success" onClick={handlePrintQR}>
                            🖨️ Print QR
                        </button>
                        <button className="btn btn-outline" onClick={handleCreateAnother}>
                            ➕ Create Another
                        </button>
                    </div>

                    <p style={{ marginTop: '25px', color: '#718096', fontSize: '0.88rem' }}>
                        💡 Tip: Print this QR and stick it on the medicine packaging before shipping.
                    </p>
                </div>
            )}
        </div>
    );
}

export default CreateBatch;