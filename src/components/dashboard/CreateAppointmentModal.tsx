'use client';

import { useState, useEffect } from 'react';
import { createAppointment, generateTimeSlots, getSpecialists, deleteWaitlistEntry } from '@/lib/store';
import { Specialist } from '@/lib/types';

interface CreateAppointmentModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: {
        name?: string;
        phone?: string;
        email?: string;
        date?: string;
        time?: string;
        waitlistEntryId?: string;
    };
}

export default function CreateAppointmentModal({ onClose, onSuccess, initialData }: CreateAppointmentModalProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        date: initialData?.date || new Date().toISOString().split('T')[0],
        time: initialData?.time || '',
        duration: 30,
        notes: '',
        recurringType: 'none' as 'none' | 'weekly' | 'biweekly' | 'monthly',
    });
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [selectedSpecialistId, setSelectedSpecialistId] = useState('');
    const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        getSpecialists().then(specs => {
            setSpecialists(specs);
            if (specs.length > 0) setSelectedSpecialistId(specs[0].id);
        });
    }, []);

    useEffect(() => {
        if (formData.date) {
            setLoadingSlots(true);
            generateTimeSlots(formData.date, undefined, selectedSpecialistId, formData.duration).then(slots => {
                setTimeSlots(slots);
                setLoadingSlots(false);
            });
        }
    }, [formData.date, selectedSpecialistId, formData.duration]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createAppointment({
                ...formData,
                verificationMethod: 'sms',
            }, selectedSpecialistId, 'confirmed');

            if (initialData?.waitlistEntryId) {
                await deleteWaitlistEntry(initialData.waitlistEntryId);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to create appointment');
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>Create New Appointment</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose} type="button">
                        x
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" htmlFor="clientName">Client Name *</label>
                                <input
                                    id="clientName"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" htmlFor="clientPhone">Phone Number *</label>
                                <input
                                    id="clientPhone"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" htmlFor="clientEmail">Email (Optional)</label>
                            <input
                                id="clientEmail"
                                className="form-input"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" htmlFor="aptDate">Date *</label>
                                <input
                                    id="aptDate"
                                    className="form-input"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" htmlFor="aptDuration">Duration (min)</label>
                                <select
                                    id="aptDuration"
                                    className="form-input form-select"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                >
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>60 minutes</option>
                                    <option value={90}>90 minutes</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Time *</label>
                            {loadingSlots ? (
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Loading times...</div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 'var(--space-2)', maxHeight: '150px', overflowY: 'auto' }}>
                                    {timeSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            type="button"
                                            disabled={!slot.available}
                                            onClick={() => setFormData({ ...formData, time: slot.time })}
                                            className={`btn btn-sm ${formData.time === slot.time ? 'btn-primary' : 'btn-secondary'}`}
                                            style={{ opacity: slot.available ? 1 : 0.5, cursor: slot.available ? 'pointer' : 'not-allowed' }}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                    {timeSlots.length === 0 && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>No available times for this date.</span>}
                                </div>
                            )}
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" htmlFor="specSelect">Specialist</label>
                            <select
                                id="specSelect"
                                className="form-input form-select"
                                value={selectedSpecialistId}
                                onChange={(e) => setSelectedSpecialistId(e.target.value)}
                            >
                                {specialists.map(spec => (
                                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" htmlFor="notes">Notes (Optional)</label>
                            <textarea
                                id="notes"
                                className="form-input"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={2}
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" htmlFor="recurringType">Recurring</label>
                            <select
                                id="recurringType"
                                className="form-input form-select"
                                value={formData.recurringType}
                                onChange={(e) => setFormData({ ...formData, recurringType: e.target.value as any })}
                            >
                                <option value="none">One time only</option>
                                <option value="weekly">Every week</option>
                                <option value="biweekly">Every two weeks</option>
                                <option value="monthly">Every month</option>
                            </select>
                        </div>

                        <div className="modal-footer" style={{ padding: 0, marginTop: 'var(--space-2)' }}>
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading || !formData.time}>
                                {loading ? 'Creating...' : 'Create Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
