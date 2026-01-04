'use client';

import { useState } from 'react';
import { mockAvailability, mockBusinesses } from '@/lib/data';

const business = mockBusinesses[0];
const initialAvailability = mockAvailability.find(a => a.businessId === business.id) || {
    businessId: business.id,
    workingDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '18:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    appointmentDurations: [15, 30, 45, 60],
    defaultDuration: 30,
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityPage() {
    const [availability, setAvailability] = useState(initialAvailability);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleDay = (dayIndex: number) => {
        setAvailability(prev => ({
            ...prev,
            workingDays: prev.workingDays.includes(dayIndex)
                ? prev.workingDays.filter(d => d !== dayIndex)
                : [...prev.workingDays, dayIndex].sort(),
        }));
    };

    const toggleDuration = (duration: number) => {
        setAvailability(prev => ({
            ...prev,
            appointmentDurations: prev.appointmentDurations.includes(duration)
                ? prev.appointmentDurations.filter(d => d !== duration)
                : [...prev.appointmentDurations, duration].sort((a, b) => a - b),
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
            }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>Availability Settings</h1>
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
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                <polyline points="17,21 17,13 7,13 7,21" />
                                <polyline points="7,3 7,8 15,8" />
                            </svg>
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Working Days */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Working Days</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Select the days when you're available for appointments.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 'var(--space-3)',
                }}>
                    {dayNames.map((day, index) => (
                        <button
                            key={day}
                            onClick={() => toggleDay(index)}
                            style={{
                                padding: 'var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                border: availability.workingDays.includes(index)
                                    ? '2px solid var(--color-primary-500)'
                                    : '1px solid var(--border-color)',
                                background: availability.workingDays.includes(index)
                                    ? 'rgba(20, 184, 166, 0.1)'
                                    : 'var(--bg-glass)',
                                color: availability.workingDays.includes(index)
                                    ? 'var(--color-primary-400)'
                                    : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                fontWeight: 'var(--font-medium)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Working Hours */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Working Hours</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Set your daily working hours.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-6)',
                }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="startTime">Start Time</label>
                        <input
                            id="startTime"
                            type="time"
                            className="form-input"
                            value={availability.startTime}
                            onChange={(e) => setAvailability(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="endTime">End Time</label>
                        <input
                            id="endTime"
                            type="time"
                            className="form-input"
                            value={availability.endTime}
                            onChange={(e) => setAvailability(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            {/* Break Time */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Break Time</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Set your daily break time. No appointments will be scheduled during this period.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-6)',
                }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="breakStart">Break Start</label>
                        <input
                            id="breakStart"
                            type="time"
                            className="form-input"
                            value={availability.breakStart || ''}
                            onChange={(e) => setAvailability(prev => ({ ...prev, breakStart: e.target.value }))}
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="breakEnd">Break End</label>
                        <input
                            id="breakEnd"
                            type="time"
                            className="form-input"
                            value={availability.breakEnd || ''}
                            onChange={(e) => setAvailability(prev => ({ ...prev, breakEnd: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            {/* Appointment Durations */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Appointment Durations</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Select the appointment durations you offer.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
                    {[15, 30, 45, 60, 90].map((duration) => (
                        <button
                            key={duration}
                            onClick={() => toggleDuration(duration)}
                            style={{
                                padding: 'var(--space-3) var(--space-6)',
                                borderRadius: 'var(--radius-lg)',
                                border: availability.appointmentDurations.includes(duration)
                                    ? '2px solid var(--color-primary-500)'
                                    : '1px solid var(--border-color)',
                                background: availability.appointmentDurations.includes(duration)
                                    ? 'rgba(20, 184, 166, 0.1)'
                                    : 'var(--bg-glass)',
                                color: availability.appointmentDurations.includes(duration)
                                    ? 'var(--color-primary-400)'
                                    : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                fontWeight: 'var(--font-medium)',
                            }}
                        >
                            {duration} min
                        </button>
                    ))}
                </div>

                <div className="form-group" style={{ margin: 0, maxWidth: '300px' }}>
                    <label className="form-label" htmlFor="defaultDuration">Default Duration</label>
                    <select
                        id="defaultDuration"
                        className="form-input form-select"
                        value={availability.defaultDuration}
                        onChange={(e) => setAvailability(prev => ({ ...prev, defaultDuration: parseInt(e.target.value) }))}
                    >
                        {availability.appointmentDurations.map((duration) => (
                            <option key={duration} value={duration}>
                                {duration} minutes
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Preview */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, transparent 100%)',
            }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Schedule Summary</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 'var(--space-4)',
                }}>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                            Working Days
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                            {availability.workingDays.length === 0
                                ? 'No days selected'
                                : availability.workingDays.map(d => dayNames[d].slice(0, 3)).join(', ')}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                            Working Hours
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                            {availability.startTime} - {availability.endTime}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                            Break Time
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                            {availability.breakStart && availability.breakEnd
                                ? `${availability.breakStart} - ${availability.breakEnd}`
                                : 'Not set'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                            Default Appointment
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                            {availability.defaultDuration} minutes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
