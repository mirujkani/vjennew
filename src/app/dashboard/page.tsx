'use client';

import Link from 'next/link';
import { mockAppointments, mockBusinesses } from '@/lib/data';

const business = mockBusinesses[0];
const appointments = mockAppointments.filter(a => a.businessId === business.id);

const todayStr = new Date().toISOString().split('T')[0];
const todayAppointments = appointments.filter(a => a.date === todayStr);

// Get next 7 days appointments
const next7Days: Date[] = [];
for (let i = 0; i < 7; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);
  next7Days.push(date);
}
const weekAppointments = appointments.filter(a => next7Days.includes(a.date));

const stats = [
    {
        label: "Today's Appointments",
        value: todayAppointments.length,
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        color: 'var(--color-primary-500)',
    },
    {
        label: 'This Week',
        value: weekAppointments.length,
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
        ),
        color: 'var(--color-accent-500)',
    },
    {
        label: 'Total Clients',
        value: 24,
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
        color: 'var(--color-success-500)',
    },
    {
        label: 'Completion Rate',
        value: '95%',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
        ),
        color: 'var(--color-warning-500)',
    },
];

export default function DashboardPage() {
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const formatDate = (dateStr: string) => {
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

    return (
        <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Dashboard</h1>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className="stat-card animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div
                            className="stat-card-icon"
                            style={{ background: `${stat.color}15`, color: stat.color }}
                        >
                            {stat.icon}
                        </div>
                        <div className="stat-card-value">{stat.value}</div>
                        <div className="stat-card-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-8)',
                flexWrap: 'wrap',
            }}>
                <button className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Appointment
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText('https://v.app/physio123')}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy Booking Link
                </button>
                <Link href="/dashboard/availability" className="btn btn-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                    Set Availability
                </Link>
            </div>

            {/* Upcoming Appointments */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-6)',
                }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Upcoming Appointments</h2>
                    <Link href="/dashboard/appointments" className="btn btn-ghost btn-sm">
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9,18 15,12 9,6" />
                        </svg>
                    </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {appointments.slice(0, 5).map((apt, index) => (
                        <div
                            key={apt.id}
                            className="appointment-card animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="appointment-time">
                                <div className="appointment-time-value">{formatTime(apt.time)}</div>
                                <div className="appointment-time-label">{apt.duration}min</div>
                            </div>
                            <div className="appointment-details">
                                <div className="appointment-client">{apt.clientName}</div>
                                <div className="appointment-info">
                                    {formatDate(apt.date)} • {apt.notes || 'No notes'}
                                </div>
                            </div>
                            <div className="appointment-actions">
                                <span
                                    className="badge"
                                    style={{
                                        background: `${getStatusColor(apt.status)}15`,
                                        color: getStatusColor(apt.status),
                                    }}
                                >
                                    {apt.status}
                                </span>
                                <button className="btn btn-ghost btn-icon btn-sm" title="More options">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="12" cy="5" r="1" />
                                        <circle cx="12" cy="19" r="1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {appointments.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--space-8)',
                            color: 'var(--text-secondary)',
                        }}>
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }}
                            >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <p style={{ margin: 0 }}>No upcoming appointments</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Today's Schedule Overview */}
            <div className="card">
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Today's Schedule</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 'var(--space-2)',
                }}>
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map((time) => {
                        const hasAppointment = todayAppointments.some(a => a.time === time);
                        return (
                            <div
                                key={time}
                                style={{
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center',
                                    fontSize: 'var(--text-sm)',
                                    background: hasAppointment ? 'rgba(20, 184, 166, 0.15)' : 'var(--bg-glass)',
                                    border: hasAppointment ? '1px solid var(--color-primary-500)' : '1px solid var(--border-color)',
                                    color: hasAppointment ? 'var(--color-primary-400)' : 'var(--text-secondary)',
                                }}
                            >
                                {time}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
