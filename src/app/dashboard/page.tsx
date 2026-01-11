'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardStats, getBusiness } from '@/lib/store';
import { Appointment, Business } from '@/lib/types';

export default function DashboardPage() {
    const [business, setBusiness] = useState<Business | null>(null);
    const [stats, setStats] = useState<{
        todayCount: number;
        weekCount: number;
        totalClients: number;
        todayAppointments: Appointment[];
        upcomingAppointments: Appointment[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [biz, statsData] = await Promise.all([
                    getBusiness(),
                    getDashboardStats()
                ]);
                setBusiness(biz);
                setStats(statsData);
            } catch (error) {
                console.error('Error loading dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const formatTime = (time: string) => {
        return time;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (dateStr === today.toISOString().split('T')[0]) {
            return 'Sot';
        } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
            return 'Nesër';
        }
        return date.toLocaleDateString('sq-AL', { weekday: 'short', month: 'short', day: 'numeric' });
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

    const copyBookingLink = () => {
        if (business) {
            const link = `${window.location.origin}/${business.uniqueLink}`;
            navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                <div className="spinner" />
            </div>
        );
    }

    const statCards = [
        {
            label: "Terminet e Sotme",
            value: stats?.todayCount || 0,
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
            label: 'Këtë Javë',
            value: stats?.weekCount || 0,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                </svg>
            ),
            color: 'var(--color-accent-500)',
        },
        {
            label: 'Klientë Total',
            value: stats?.totalClients || 0,
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
    ];

    return (
        <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Dashboard</h1>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
                {statCards.map((stat, index) => (
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
                <Link href="/dashboard/appointments" className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Cakto Termin
                </Link>
                <button className="btn btn-secondary" onClick={copyBookingLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    {copied ? 'U kopjua!' : 'Kopjo Linkun'}
                </button>
                <Link href="/dashboard/availability" className="btn btn-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                    Cakto Disponueshmërinë
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
                    <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Terminet e Ardhshme</h2>
                    <Link href="/dashboard/appointments" className="btn btn-ghost btn-sm">
                        Shiko të Gjitha
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9,18 15,12 9,6" />
                        </svg>
                    </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {(stats?.upcomingAppointments || []).slice(0, 5).map((apt, index) => (
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
                                    {formatDate(apt.date)} {apt.serviceName && `• ${apt.serviceName}`}
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
                                    {apt.status === 'confirmed' ? 'Konfirmuar' : apt.status === 'pending' ? 'Në pritje' : apt.status}
                                </span>
                            </div>
                        </div>
                    ))}

                    {(!stats?.upcomingAppointments || stats.upcomingAppointments.length === 0) && (
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
                            <p style={{ margin: 0 }}>Nuk keni termine të ardhshme</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
