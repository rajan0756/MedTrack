import React from 'react';

function Dashboard({ account }) {
    const stats = [
        { icon: '💊', number: 10, label: 'Total Batches', color: '#667eea' },
        { icon: '✅', number: 8, label: 'Verified', color: '#48bb78' },
        { icon: '⚠️', number: 2, label: 'Counterfeit', color: '#fc8181' },
    ];

    const steps = [
        { icon: '🏭', text: 'Manufacturer creates medicine on blockchain' },
        { icon: '📸', text: 'QR code is auto-generated for the batch' },
        { icon: '🚚', text: 'Medicine moves through the supply chain' },
        { icon: '🔍', text: 'Patient scans QR to verify authenticity' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: '-0.8px',
                    marginBottom: '8px'
                }}>
                    📊 Dashboard
                </h2>
                <p style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.95rem',
                    fontWeight: 500
                }}>
                    Connected as: <strong style={{ color: '#00d4ff' }}>
                        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
                    </strong>
                </p>
            </div>

            <div className="dashboard-grid">
                {stats.map((stat, i) => (
                    <div className="stat-card" key={i}>
                        <div className="icon">{stat.icon}</div>
                        <div className="number">{stat.number}</div>
                        <div className="label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '20px' }}>📋 How MedTrack Works</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '15px 20px',
                                background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
                                borderRadius: '14px',
                                borderLeft: '4px solid #667eea',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <span style={{ fontSize: '1.8rem' }}>{step.icon}</span>
                            <span style={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: '#2d3748'
                            }}>
                                <strong style={{ color: '#667eea' }}>{i + 1}.</strong> {step.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;