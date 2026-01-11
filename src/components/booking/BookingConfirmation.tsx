'use client';

import { useState } from 'react';
import { BookingFormData } from '@/lib/types';

interface BookingConfirmationProps {
    businessName: string;
    specialistName: string;
    date: string;
    time: string;
    duration: number;
    onConfirm: (data: BookingFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    isWaitlist?: boolean;
    serviceName?: string;
    servicePrice?: number;
}

export default function BookingConfirmation({
    businessName,
    specialistName,
    date,
    time,
    duration,
    onConfirm,
    onCancel,
    isSubmitting = false,
    isWaitlist = false,
    serviceName,
    servicePrice,
}: BookingConfirmationProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        notes: '',
        verificationMethod: 'whatsapp' as 'whatsapp' | 'sms',
        recurringType: 'none' as 'none' | 'weekly' | 'biweekly' | 'monthly',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('sq-AL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeStr: string) => {
        return timeStr;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Emri është i detyrueshëm';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Numri i telefonit është i detyrueshëm';
        } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
            newErrors.phone = 'Ju lutem shkruani një numër të vlefshëm';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Ju lutem shkruani një email të vlefshëm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onConfirm({
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                date,
                time,
                duration,
                notes: formData.notes || undefined,
                verificationMethod: formData.verificationMethod,
                recurringType: formData.recurringType,
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>
                        {isWaitlist ? 'Bashkohuni në Listën e Pritjes' : 'Konfirmoni Terminin Tuaj'}
                    </h2>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={onCancel}
                        aria-label="Mbyll"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {/* Appointment Summary */}
                    <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                                </svg>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                                    {businessName}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {specialistName}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {formatDate(date)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                </svg>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                    {isWaitlist ? 'Interesi për oraret: ' : ''}
                                    {formatTime(time)} {duration > 0 ? `(${duration} min)` : ''}
                                </span>
                            </div>
                            {serviceName && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px dashed var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="2">
                                            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                                            {serviceName}
                                        </span>
                                    </div>
                                    {servicePrice !== undefined && (
                                        <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-primary-500)' }}>
                                            €{servicePrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">
                                Emri i plotë *
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                placeholder="Shkruani emrin tuaj"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={errors.name ? { borderColor: 'var(--color-error-500)' } : {}}
                            />
                            {errors.name && (
                                <span style={{ color: 'var(--color-error-500)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">
                                Numri i telefonit *
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                className="form-input"
                                placeholder="+383 44 123 456"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                style={errors.phone ? { borderColor: 'var(--color-error-500)' } : {}}
                            />
                            {errors.phone && (
                                <span style={{ color: 'var(--color-error-500)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
                                    {errors.phone}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email (opsionale)
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="email@shembull.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={errors.email ? { borderColor: 'var(--color-error-500)' } : {}}
                            />
                            {errors.email && (
                                <span style={{ color: 'var(--color-error-500)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="notes">
                                Shënime (opsionale)
                            </label>
                            <textarea
                                id="notes"
                                className="form-input form-textarea"
                                placeholder=" ndonjë informacion shtesë..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                            />
                        </div>

                        {/* Verification Method Selection - Mandatory */}
                        <div className="form-group">
                            <label className="form-label">Mënyra e verifikimit *</label>
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                {/* WhatsApp Option */}
                                <label
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-3)',
                                        border: formData.verificationMethod === 'whatsapp'
                                            ? '2px solid #25D366'
                                            : '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        background: formData.verificationMethod === 'whatsapp'
                                            ? 'rgba(37, 211, 102, 0.05)'
                                            : 'var(--bg-glass)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="verification"
                                        value="whatsapp"
                                        checked={formData.verificationMethod === 'whatsapp'}
                                        onChange={() => setFormData({ ...formData, verificationMethod: 'whatsapp' })}
                                        style={{ accentColor: '#25D366' }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        <span style={{ fontWeight: 'var(--font-medium)' }}>WhatsApp</span>
                                    </div>
                                </label>

                                {/* SMS Option */}
                                <label
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-3)',
                                        border: formData.verificationMethod === 'sms'
                                            ? '2px solid var(--color-primary-500)'
                                            : '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        background: formData.verificationMethod === 'sms'
                                            ? 'rgba(20, 184, 166, 0.05)'
                                            : 'var(--bg-glass)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="verification"
                                        value="sms"
                                        checked={formData.verificationMethod === 'sms'}
                                        onChange={() => setFormData({ ...formData, verificationMethod: 'sms' })}
                                        style={{ accentColor: 'var(--color-primary-500)' }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        <span style={{ fontWeight: 'var(--font-medium)' }}>SMS</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        {/* Recurring Appointment Selection removed for visitors */}
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
                        Anulo
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner" style={{ width: '16px', height: '16px' }} />
                                Duke rezervuar...
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                                {isWaitlist ? 'Dërgo Kërkesën' : 'Konfirmo Terminin'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
