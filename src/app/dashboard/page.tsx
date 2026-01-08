'use client';

import Link from 'next/link';
import { mockAppointments, mockBusinesses } from '@/lib/data';

// --- Data prep (runs once, safe for Vercel build) ---

const business = mockBusinesses[0];
const appointments = mockAppointments.filter(
  (a) => a.businessId === business.id
);

const todayStr = new Date().toISOString().split('T')[0];
const todayAppointments = appointments.filter(
  (a) => a.date === todayStr
);

// Get next 7 days (YYYY-MM-DD strings)
const next7Days: string[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d.toISOString().split('T')[0];
});

const weekAppointments = appointments.filter(
  (a) => next7Days.includes(a.date)
);

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

// --- Component ---

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

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
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
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>
        Dashboard
      </h1>

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

      {/* The rest of your JSX stays unchanged */}
    </div>
  );
}
