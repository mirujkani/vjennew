'use client';

import { useState } from 'react';
import { mockAppointments, mockBusinesses } from '@/lib/data';

const business = mockBusinesses[0];
const allAppointments = mockAppointments.filter(a => a.businessId === business.id);

export default function AppointmentsPage() {
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const filteredAppointments = allAppointments.filter(apt => {
        if (filter !== 'all' && apt.status !== filter) return false;
        if (selectedDate && apt.date !== selectedDate) return false;
        return true;
    });

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatShortDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (dateStr === today.toISOString().split('T')[0]) {
            return 'Today';
        } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
            return 'Tomorrow';
        }
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'var(--color-success-500)';
            case 'pending':
                return 'var(--color-warning-500)';
            case 'cancelled':
                return 'var(--color-error-500)';
            default:
                return 'var(--text-muted)';
        }
    };

    // Group appointments by date
    const groupedAppointments = filteredAppointments.reduce((acc, apt) => {
        if (!acc[apt.date]) {
            acc[apt.date] = [];
        }
        acc[apt.date].push(apt);
        return acc;
    }, {} as Record<string, typeof allAppointments>);

    const sortedDates = Object.keys(groupedAppointments).sort();

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
                <h1 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>Appointments</h1>
                <button className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Appointment
                </button>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                flexWrap: 'wrap',
            }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((f) => (
                        <button
                            key={f}
                            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {selectedDate && (
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedDate(null)}
                    >
                        Clear date filter
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Appointments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {sortedDates.map((date) => (
                    <div key={date}>
                        <h3 style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: 'var(--text-secondary)',
                            marginBottom: 'var(--space-3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {formatShortDate(date)}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {groupedAppointments[date]
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map((apt) => (
                                    <div key={apt.id} className="card" style={{ padding: 'var(--space-4)' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--space-4)',
                                            flexWrap: 'wrap',
                                        }}>
                                            <div style={{
                                                minWidth: '80px',
                                                padding: 'var(--space-2)',
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: 'var(--radius-md)',
                                                textAlign: 'center',
                                            }}>
                                                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                                                    {formatTime(apt.time)}
                                                </div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                                    {apt.duration} min
                                                </div>
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-3)',
                                                    marginBottom: 'var(--space-2)',
                                                }}>
                                                    <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                                                        {apt.clientName}
                                                    </span>
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            background: `${getStatusColor(apt.status)}15`,
                                                            color: getStatusColor(apt.status),
                                                        }}
                                                    >
                                                        {apt.status}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 'var(--space-1)',
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--text-secondary)',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                                        </svg>
                                                        {apt.clientPhone}
                                                    </div>
                                                    {apt.clientEmail && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                                <polyline points="22,6 12,13 2,6" />
                                                            </svg>
                                                            {apt.clientEmail}
                                                        </div>
                                                    )}
                                                    {apt.notes && (
                                                        <div style={{ marginTop: 'var(--space-2)', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                                                            "{apt.notes}"
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <button className="btn btn-secondary btn-sm" title="Edit">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button className="btn btn-secondary btn-sm" title="Cancel" style={{ color: 'var(--color-error-500)' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}

                {sortedDates.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--text-muted)"
                            strokeWidth="1.5"
                            style={{ margin: '0 auto var(--space-4)' }}
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                            No appointments found
                        </h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            {filter !== 'all' ? 'Try changing your filters' : 'Create your first appointment to get started'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
