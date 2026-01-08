'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface DemoModalProps {
    onClose: () => void;
}

export default function DemoModal({ onClose }: DemoModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        businessName: '',
        email: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await addDoc(collection(db, 'demo_requests'), {
                ...formData,
                createdAt: serverTimestamp(),
                status: 'new',
            });
            setSubmitted(true);
            setTimeout(() => onClose(), 3000); // Close after 3 seconds
        } catch (err) {
            console.error('Error submitting demo request:', err);
            setError('Ndodhi një gabim. Ju lutem provoni përsëri.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>
                        {submitted ? 'Kërkesa u dërgua!' : 'Rezervoni një Demo'}
                    </h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Mbyll">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'rgba(34, 197, 94, 0.1)',
                                color: 'var(--color-success-500)',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--space-4)',
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                            </div>
                            <p>
                                Faleminderit! Ne do t&apos;ju kontaktojmë së shpejti për të caktuar demon.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {error && (
                                <div style={{ color: 'var(--color-error-500)', fontSize: 'var(--text-sm)' }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" htmlFor="name">Emri *</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" htmlFor="surname">Mbiemri *</label>
                                    <input
                                        id="surname"
                                        type="text"
                                        className="form-input"
                                        value={formData.surname}
                                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" htmlFor="businessName">Emri i Biznesit *</label>
                                <input
                                    id="businessName"
                                    type="text"
                                    className="form-input"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" htmlFor="phone">Numri i Telefonit *</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    placeholder="+383..."
                                />
                            </div>

                            <div className="modal-footer" style={{ padding: 0, marginTop: 'var(--space-2)' }}>
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                                    Anulo
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner" style={{ width: '16px', height: '16px' }} />
                                            Duke dërguar...
                                        </>
                                    ) : (
                                        'Dërgo Kërkesën'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
