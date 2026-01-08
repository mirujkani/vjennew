'use client';

import { useState, useEffect } from 'react';
import { getAppointments, cancelAppointment, deleteAppointment, approveAppointment, getWaitlistEntries, deleteWaitlistEntry, generateTimeSlots } from '@/lib/store';
import { Appointment, WaitlistEntry } from '@/lib/types';
import CreateAppointmentModal from '@/components/dashboard/CreateAppointmentModal';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [initialCreateData, setInitialCreateData] = useState<{ name?: string; phone?: string; email?: string; date?: string; time?: string; waitlistEntryId?: string } | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'waitlist'>('upcoming');
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [selectedRecurring, setSelectedRecurring] = useState<'none' | 'weekly' | 'biweekly' | 'monthly'>('none');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [slotsByDate, setSlotsByDate] = useState<Record<string, { time: string; available: boolean }[]>>({});
    const [loadingSlots, setLoadingSlots] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [aptData, waitData] = await Promise.all([
                getAppointments(),
                getWaitlistEntries()
            ]);
            setAppointments(aptData);
            setWaitlistEntries(waitData);

            // Fetch slots for all dates shown in appointments
            setLoadingSlots(true);
            const todayStr = new Date().toISOString().split('T')[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            const appointmentDates = Array.from(new Set(aptData.map(apt => apt.date)));
            const datesToFetchSet = new Set(appointmentDates);

            // Ensure today and tomorrow are included for slot fetching
            datesToFetchSet.add(todayStr);
            datesToFetchSet.add(tomorrowStr);

            const datesToFetch = Array.from(datesToFetchSet)
                .filter(d => d >= todayStr)
                .sort((a, b) => a.localeCompare(b))
                .slice(0, 15);

            const allSlots: Record<string, { time: string; available: boolean }[]> = {};

            for (const date of datesToFetch) {
                const slots = await generateTimeSlots(date);
                allSlots[date] = slots;
            }

            setSlotsByDate(allSlots);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
            setLoadingSlots(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCancel = async (id: string) => {
        if (confirm('A jeni të sigurt që dëshironi ta anuloni këtë termin?')) {
            try {
                await cancelAppointment(id);
                await loadData();
            } catch (error) {
                console.error('Error cancelling appointment:', error);
                alert('Dështoi anulimi i terminit');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('A jeni të sigurt që dëshironi ta fshini këtë termin? Ky veprim nuk mund të zhbëhet.')) {
            try {
                await deleteAppointment(id);
                await loadData();
            } catch (error) {
                console.error('Error deleting appointment:', error);
                alert('Dështoi fshirja e terminit');
            }
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveAppointment(id, selectedRecurring === 'none' ? undefined : selectedRecurring);
            setApprovingId(null);
            setSelectedRecurring('none');
            await loadData();
        } catch (error) {
            console.error('Error approving appointment:', error);
            alert('Dështoi konfirmimi i terminit');
        }
    };

    const handleBookNextSession = (apt: Appointment) => {
        setInitialCreateData({
            name: apt.clientName,
            phone: apt.clientPhone,
            email: apt.clientEmail || '',
        });
        setShowCreateModal(true);
    };

    const handleAssignWaitlist = (entry: WaitlistEntry) => {
        setInitialCreateData({
            name: entry.clientName,
            phone: entry.clientPhone,
            email: entry.clientEmail || '',
            date: entry.preferredDates[0],
            time: entry.preferredTimes[0],
            waitlistEntryId: entry.id,
        });
        setShowCreateModal(true);
    };

    const handleDeleteWaitlist = async (id: string) => {
        if (confirm('A jeni të sigurt që dëshironi ta fshini këtë kërkesë nga lista e pritjes?')) {
            try {
                await deleteWaitlistEntry(id);
                await loadData();
            } catch (error) {
                console.error('Error deleting waitlist entry:', error);
                alert('Dështoi fshirja e kërkesës');
            }
        }
    };

    const handleCreateNew = () => {
        setInitialCreateData(undefined);
        setShowCreateModal(true);
    };

    const filteredAppointments = appointments.filter(apt => {
        if (filter !== 'all' && apt.status !== filter) return false;

        const today = new Date().toISOString().split('T')[0];
        if (activeTab === 'upcoming') {
            return apt.date >= today;
        } else {
            return apt.date < today;
        }
    });

    const formatTime = (time: string) => {
        return time;
    };

    const formatShortDate = (dateStr: string) => {
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
                return '#10b981'; // Vibrant Green
            case 'pending':
                return '#f59e0b'; // Vibrant Orange
            case 'cancelled':
                return '#ef4444'; // Vibrant Red
            default:
                return 'var(--text-muted)';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Konfirmuar';
            case 'pending': return 'Në pritje';
            case 'cancelled': return 'Anuluar';
            case 'all': return 'Të gjitha';
            default: return status;
        }
    };

    // Group appointments by date
    const groupedAppointments = filteredAppointments.reduce((acc, apt) => {
        if (!acc[apt.date]) {
            acc[apt.date] = [];
        }
        acc[apt.date].push(apt);
        return acc;
    }, {} as Record<string, Appointment[]>);

    const sortedDates = Array.from(new Set([
        ...Object.keys(groupedAppointments),
        ...(activeTab === 'upcoming' ? [new Date().toISOString().split('T')[0]] : [])
    ])).sort((a, b) => {
        return activeTab === 'upcoming' ? a.localeCompare(b) : b.localeCompare(a);
    }).filter(date => {
        // Only show Today in upcoming even if empty
        // Past dates should only show if they have appointments
        if (activeTab === 'past') return date < new Date().toISOString().split('T')[0];
        return date >= new Date().toISOString().split('T')[0];
    });

    // Calendar View Helpers
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const monthNames = [
        'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
        'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'
    ];
    const weekDays = ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (number | null)[] = [];
        for (let i = 0; i < startingDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    };

    const formatDateStr = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    };

    const calendarDays = getDaysInMonth(currentMonth);

    const CalendarView = () => (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6" /></svg>
                </button>
                <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', background: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {weekDays.map(day => (
                    <div key={day} style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-2)', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--text-muted)' }}>
                        {day}
                    </div>
                ))}
                {calendarDays.map((day, i) => {
                    const dateStr = day ? formatDateStr(day) : null;
                    const dayAppointments = dateStr ? appointments.filter(a => a.date === dateStr) : [];
                    const isToday = day && formatDateStr(day) === new Date().toISOString().split('T')[0];

                    return (
                        <div
                            key={i}
                            style={{
                                background: day ? 'var(--bg-card)' : 'transparent',
                                minHeight: '100px',
                                padding: 'var(--space-2)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-1)',
                                position: 'relative'
                            }}
                        >
                            {day && (
                                <>
                                    <span style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: isToday ? 'bold' : 'normal',
                                        color: isToday ? 'var(--color-primary-500)' : 'var(--text-secondary)',
                                        marginBottom: 'var(--space-1)'
                                    }}>
                                        {day}
                                    </span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', maxHeight: '70px' }}>
                                        {dayAppointments.slice(0, 3).map(apt => (
                                            <div
                                                key={apt.id}
                                                style={{
                                                    fontSize: '10px',
                                                    padding: '2px 4px',
                                                    borderRadius: '2px',
                                                    background: `${getStatusColor(apt.status)}20`,
                                                    color: getStatusColor(apt.status),
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    textDecoration: apt.status === 'cancelled' ? 'line-through' : 'none'
                                                }}
                                                title={`${apt.time} - ${apt.clientName}`}
                                            >
                                                {apt.time} {apt.clientName}
                                            </div>
                                        ))}
                                        {dayAppointments.length > 3 && (
                                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                                +{dayAppointments.length - 3} tjerë
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        style={{ position: 'absolute', inset: 0, background: 'transparent', border: 'none', cursor: 'pointer' }}
                                        onClick={() => {
                                            setFilter('all');
                                            setActiveTab(new Date(dateStr!) < new Date(new Date().toISOString().split('T')[0]) ? 'past' : 'upcoming');
                                            setViewMode('list');
                                            // Scroll to date handled by browser if we wanted, but for now just switch view
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                <div className="spinner" />
            </div>
        );
    }

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <h1 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>Terminet</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                        <button
                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setViewMode('list')}
                            title="Pamja Listë"
                            style={{ padding: 'var(--space-1) var(--space-2)' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                            </svg>
                        </button>
                        <button
                            className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setViewMode('calendar')}
                            title="Pamja Kalendar"
                            style={{ padding: 'var(--space-1) var(--space-2)' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </button>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleCreateNew}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 'var(--space-2)' }}>
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Cakto Termin
                </button>
            </div>

            {/* Tabs & Filters */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
            }}>
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--border-color)',
                    gap: 'var(--space-6)',
                }}>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        style={{
                            padding: 'var(--space-3) 0',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: activeTab === 'upcoming' ? 'var(--color-primary-500)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'upcoming' ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Të ardhshme
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        style={{
                            padding: 'var(--space-3) 0',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: activeTab === 'past' ? 'var(--color-primary-500)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'past' ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Të kaluara
                    </button>
                    <button
                        onClick={() => setActiveTab('waitlist')}
                        style={{
                            padding: 'var(--space-3) 0',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: activeTab === 'waitlist' ? 'var(--color-primary-500)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'waitlist' ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Lista e Pritjes ({waitlistEntries.length})
                    </button>
                </div>

                {activeTab !== 'waitlist' && (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((f) => (
                            <button
                                key={f}
                                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter(f)}
                            >
                                {getStatusLabel(f)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content View */}
            {activeTab === 'waitlist' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {waitlistEntries.map((entry) => (
                        <div key={entry.id} className="card" style={{ padding: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                                        <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{entry.clientName}</span>
                                        <span className="badge badge-secondary" style={{ fontSize: '10px' }}>Lista e Pritjes</span>
                                    </div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                                            {entry.clientPhone}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                            Presa për: {entry.preferredDates.join(', ')} në {entry.preferredTimes.join(', ')}
                                        </div>
                                        {entry.notes && <div style={{ fontStyle: 'italic', marginTop: 'var(--space-1)' }}>&quot;{entry.notes}&quot;</div>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleAssignWaitlist(entry)}>
                                        Cakto Orarin
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteWaitlist(entry.id)} style={{ color: 'var(--color-error-500)' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {waitlistEntries.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                            Nuk ka asnjë kërkesë në listën e pritjes.
                        </div>
                    )}
                </div>
            ) : viewMode === 'calendar' ? (
                <CalendarView />
            ) : (
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
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 'var(--space-2)' }}>
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {formatShortDate(date)}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {(() => {
                                    const appointments = (groupedAppointments[date] || []).map(apt => ({
                                        type: 'appointment' as const,
                                        time: apt.time,
                                        data: apt
                                    }));

                                    const slots = (slotsByDate[date] || [])
                                        .filter(slot => slot.available)
                                        .map(slot => ({
                                            type: 'slot' as const,
                                            time: slot.time,
                                            data: slot
                                        }));

                                    const merged = [...appointments, ...slots].sort((a, b) => a.time.localeCompare(b.time));

                                    return merged.map((item) => {
                                        if (item.type === 'appointment') {
                                            const apt = item.data;
                                            return (
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
                                                                <span style={{
                                                                    fontWeight: 'var(--font-semibold)',
                                                                    color: apt.status === 'cancelled' ? 'var(--text-muted)' : 'var(--text-primary)',
                                                                    textDecoration: apt.status === 'cancelled' ? 'line-through' : 'none'
                                                                }}>
                                                                    {apt.clientName}
                                                                </span>
                                                                <span
                                                                    className="badge"
                                                                    style={{
                                                                        background: `${getStatusColor(apt.status)}15`,
                                                                        color: getStatusColor(apt.status),
                                                                        fontWeight: 'var(--font-bold)',
                                                                        border: `1px solid ${getStatusColor(apt.status)}40`,
                                                                    }}
                                                                >
                                                                    {getStatusLabel(apt.status)}
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
                                                                {apt.verificationMethod && (
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                                            Verifikuar me: {apt.verificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {apt.notes && (
                                                                    <div style={{ marginTop: 'var(--space-2)', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                                                                        &quot;{apt.notes}&quot;
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                                                            {apt.status === 'pending' && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                                    {approvingId === apt.id ? (
                                                                        <>
                                                                            <select
                                                                                className="form-input form-select form-input-sm"
                                                                                style={{ width: 'auto', padding: 'var(--space-1) var(--space-2)', fontSize: '12px' }}
                                                                                value={selectedRecurring}
                                                                                onChange={(e) => setSelectedRecurring(e.target.value as any)}
                                                                            >
                                                                                <option value="none">Vetëm këtë herë</option>
                                                                                <option value="weekly">Çdo javë</option>
                                                                                <option value="biweekly">Çdo dy javë</option>
                                                                                <option value="monthly">Çdo muaj</option>
                                                                            </select>
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => handleApprove(apt.id)}
                                                                            >
                                                                                OK
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-ghost btn-sm"
                                                                                onClick={() => { setApprovingId(null); setSelectedRecurring('none'); }}
                                                                            >
                                                                                x
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={() => setApprovingId(apt.id)}
                                                                        >
                                                                            Konfirmo
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    title="Seanca e Radhës"
                                                                    onClick={() => handleBookNextSession(apt)}
                                                                >
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                                        <line x1="12" y1="18" x2="12" y2="12"></line>
                                                                        <line x1="9" y1="15" x2="15" y2="15"></line>
                                                                    </svg>
                                                                </button>
                                                                {apt.status !== 'cancelled' && (
                                                                    <button className="btn btn-secondary btn-sm" onClick={() => handleCancel(apt.id)} style={{ color: 'var(--color-warning-500)' }}>
                                                                        Anulo
                                                                    </button>
                                                                )}
                                                                <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(apt.id)} style={{ color: 'var(--color-error-500)' }}>
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            const slot = item.data;
                                            return (
                                                <div
                                                    key={`${date}-${slot.time}`}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-3)',
                                                        margin: 'var(--space-1) 0',
                                                        padding: '0 var(--space-4)',
                                                        cursor: 'pointer',
                                                        opacity: 0.7,
                                                        transition: 'opacity 0.2s'
                                                    }}
                                                    onClick={() => {
                                                        setInitialCreateData({ date, time: slot.time });
                                                        setShowCreateModal(true);
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                                                >
                                                    <div style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--color-primary-500)',
                                                        fontWeight: 'var(--font-medium)',
                                                        minWidth: '50px'
                                                    }}>
                                                        + {formatTime(slot.time)}
                                                    </div>
                                                    <div style={{
                                                        flex: 1,
                                                        height: '1px',
                                                        background: 'linear-gradient(to right, var(--color-primary-500) 0%, transparent 100%)',
                                                        opacity: 0.3
                                                    }} />
                                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                        Shto termin
                                                    </span>
                                                </div>
                                            );
                                        }
                                    });
                                })()}
                            </div>
                        </div>
                    ))}

                    {sortedDates.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <h3 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Nuk u gjet asnjë termin</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                                {filter !== 'all' ? 'Provoni të ndryshoni filtrat' : 'Shpërndani linkun tuaj për të marrë rezervime'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {showCreateModal && (
                <CreateAppointmentModal
                    initialData={initialCreateData}
                    onClose={() => {
                        setShowCreateModal(false);
                        setInitialCreateData(undefined);
                    }}
                    onSuccess={() => {
                        loadData();
                    }}
                />
            )}
        </div>
    );
}
