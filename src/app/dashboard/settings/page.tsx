'use client';

import { useState } from 'react';
import { mockBusinesses } from '@/lib/data';

const business = mockBusinesses[0];

export default function SettingsPage() {
    const [businessData, setBusinessData] = useState({
        name: business.name,
        address: business.address,
        phone: business.phone,
        email: business.email,
        description: business.description || '',
        uniqueLink: business.uniqueLink,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const copyLink = () => {
        const fullLink = `https://v.app/${businessData.uniqueLink}`;
        navigator.clipboard.writeText(fullLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateQRCode = () => {
        // In a real app, this would generate a QR code
        alert('QR Code generation would be implemented here');
    };

    return (
        <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Business Settings</h1>

            {/* Booking Link */}
            <div className="card" style={{
                marginBottom: 'var(--space-6)',
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Your Booking Link</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Share this link with your clients so they can book appointments.
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                    flexWrap: 'wrap',
                }}>
                    <div style={{
                        flex: 1,
                        minWidth: '250px',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)',
                    }}>
                        <span style={{ color: 'var(--text-muted)', marginRight: 'var(--space-1)' }}>https://v.app/</span>
                        <span style={{ color: 'var(--color-primary-400)', fontWeight: 'var(--font-medium)' }}>
                            {businessData.uniqueLink}
                        </span>
                    </div>
                    <button className="btn btn-primary" onClick={copyLink}>
                        {copied ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                                Copy Link
                            </>
                        )}
                    </button>
                    <button className="btn btn-secondary" onClick={generateQRCode}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        QR Code
                    </button>
                </div>

                <div className="form-group" style={{ margin: 0, maxWidth: '400px' }}>
                    <label className="form-label" htmlFor="uniqueLink">Custom Link Path</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>v.app/</span>
                        <input
                            id="uniqueLink"
                            type="text"
                            className="form-input"
                            value={businessData.uniqueLink}
                            onChange={(e) => setBusinessData({ ...businessData, uniqueLink: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                            placeholder="your-unique-link"
                        />
                    </div>
                </div>
            </div>

            {/* Business Information */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-6)',
                }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Business Information</h2>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner" style={{ width: '16px', height: '16px' }} />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                                Saved!
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--space-6)',
                }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="businessName">Business Name</label>
                        <input
                            id="businessName"
                            type="text"
                            className="form-input"
                            value={businessData.name}
                            onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            className="form-input"
                            value={businessData.phone}
                            onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={businessData.email}
                            onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="address">Address</label>
                        <input
                            id="address"
                            type="text"
                            className="form-input"
                            value={businessData.address}
                            onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                    <label className="form-label" htmlFor="description">Business Description</label>
                    <textarea
                        id="description"
                        className="form-input form-textarea"
                        value={businessData.description}
                        onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                        rows={3}
                        placeholder="Describe your business..."
                    />
                </div>
            </div>

            {/* WhatsApp Integration */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>WhatsApp Integration</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Configure automated WhatsApp notifications for your appointments.
                </p>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-4)',
                }}>
                    {[
                        { label: 'Booking Confirmations', description: 'Send confirmation when a booking is made', enabled: true },
                        { label: 'Appointment Reminders', description: 'Send reminder 24 hours before appointment', enabled: true },
                        { label: 'Cancellation Notices', description: 'Notify client when appointment is cancelled', enabled: false },
                    ].map((setting, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'var(--space-4)',
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)',
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                                    {setting.label}
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    {setting.description}
                                </div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                                <input
                                    type="checkbox"
                                    defaultChecked={setting.enabled}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        inset: 0,
                                        background: setting.enabled ? '#25D366' : 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'var(--transition-fast)',
                                    }}
                                >
                                    <span
                                        style={{
                                            position: 'absolute',
                                            height: '20px',
                                            width: '20px',
                                            left: setting.enabled ? '25px' : '3px',
                                            bottom: '3px',
                                            background: 'white',
                                            borderRadius: 'var(--radius-full)',
                                            transition: 'var(--transition-fast)',
                                        }}
                                    />
                                </span>
                            </label>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    background: 'rgba(37, 211, 102, 0.1)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <div>
                        <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                            WhatsApp Business API Connected
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                            Automated messages are enabled for your account
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card" style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)', color: 'var(--color-error-500)' }}>
                    Danger Zone
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    These actions are irreversible. Please proceed with caution.
                </p>
                <button className="btn btn-secondary" style={{ color: 'var(--color-error-500)', borderColor: 'var(--color-error-500)' }}>
                    Delete All Appointments
                </button>
            </div>
        </div>
    );
}
