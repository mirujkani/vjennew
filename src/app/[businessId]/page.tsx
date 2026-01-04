'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CalendarPicker from '@/components/booking/CalendarPicker';
import TimeSlotGrid from '@/components/booking/TimeSlotGrid';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import BookingSuccess from '@/components/booking/BookingSuccess';
import {
    getBusinessById,
    getPhysiotherapistsByBusiness,
    getAvailabilityByBusiness,
    getAppointmentsByDate,
    generateTimeSlots,
} from '@/lib/data';
import { BookingFormData, Physiotherapist } from '@/lib/types';

export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const businessId = params.businessId as string;

    // Get business data
    const business = getBusinessById(businessId);
    const physiotherapists = business ? getPhysiotherapistsByBusiness(business.id) : [];
    const availability = business ? getAvailabilityByBusiness(business.id) : null;

    // State
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedPhysiotherapist, setSelectedPhysiotherapist] = useState<Physiotherapist | null>(
        physiotherapists[0] || null
    );
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookedClientName, setBookedClientName] = useState('');

    // Generate time slots for selected date
    const timeSlots = useMemo(() => {
        if (!selectedDate || !availability || !business) return [];
        const existingAppointments = getAppointmentsByDate(business.id, selectedDate);
        return generateTimeSlots(availability, selectedDate, existingAppointments);
    }, [selectedDate, availability, business]);

    // Handle date selection
    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
    };

    // Handle time selection
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setShowConfirmation(true);
    };

    // Handle booking confirmation
    const handleConfirm = async (data: BookingFormData) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setBookedClientName(data.name);
        setIsSubmitting(false);
        setShowConfirmation(false);
        setShowSuccess(true);
    };

    // Handle success close
    const handleSuccessClose = () => {
        setShowSuccess(false);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    // Not found state
    if (!business) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-6)',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-6)',
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-error-500)" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h1 style={{ marginBottom: 'var(--space-4)' }}>Business Not Found</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                    The booking link you followed doesn't exist or has been removed.
                </p>
                <Link href="/" className="btn btn-primary">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    const formatSelectedDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <header style={{
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'white' }}>
                            {business.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h1 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>{business.name}</h1>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                            {business.address}
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: 'var(--space-6)',
            }}>
                {/* Business Info Card */}
                <div
                    className="card animate-fade-in-up"
                    style={{
                        marginBottom: 'var(--space-6)',
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, transparent 100%)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>
                                Book an Appointment
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 'var(--text-sm)' }}>
                                {business.description}
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <a
                                href={`tel:${business.phone}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    color: 'var(--text-secondary)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                {business.phone}
                            </a>
                            <a
                                href={`mailto:${business.email}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    color: 'var(--text-secondary)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                {business.email}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Physiotherapist Selection (if multiple) */}
                {physiotherapists.length > 1 && (
                    <div className="animate-fade-in-up stagger-1" style={{ marginBottom: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                            Select Physiotherapist
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                            {physiotherapists.map((pt) => (
                                <button
                                    key={pt.id}
                                    onClick={() => setSelectedPhysiotherapist(pt)}
                                    className={`card card-interactive ${selectedPhysiotherapist?.id === pt.id ? 'selected' : ''}`}
                                    style={{
                                        padding: 'var(--space-4)',
                                        textAlign: 'left',
                                        border: selectedPhysiotherapist?.id === pt.id ? '1px solid var(--color-primary-500)' : '1px solid var(--border-color)',
                                        background: selectedPhysiotherapist?.id === pt.id ? 'rgba(20, 184, 166, 0.1)' : 'var(--bg-glass)',
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'var(--gradient-accent)',
                                        borderRadius: 'var(--radius-full)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 'var(--space-3)',
                                    }}>
                                        <span style={{ color: 'white', fontWeight: 'var(--font-semibold)' }}>
                                            {pt.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                                        {pt.name}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                        {pt.title}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Single Physiotherapist Display */}
                {physiotherapists.length === 1 && selectedPhysiotherapist && (
                    <div
                        className="card animate-fade-in-up stagger-1"
                        style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'var(--gradient-accent)',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <span style={{ color: 'white', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-xl)' }}>
                                    {selectedPhysiotherapist.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                                    {selectedPhysiotherapist.name}
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                                    {selectedPhysiotherapist.title}
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                    {selectedPhysiotherapist.specialties.map((spec) => (
                                        <span key={spec} className="badge badge-primary">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calendar Section */}
                <div className="card animate-fade-in-up stagger-2" style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                        Select a Date
                    </h3>
                    {availability && (
                        <CalendarPicker
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            workingDays={availability.workingDays}
                        />
                    )}
                </div>

                {/* Time Slots Section */}
                {selectedDate && (
                    <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                            Available Times
                        </h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                            {formatSelectedDate(selectedDate)} • {availability?.defaultDuration || 30} min sessions
                        </p>
                        <TimeSlotGrid
                            slots={timeSlots}
                            selectedTime={selectedTime}
                            onTimeSelect={handleTimeSelect}
                        />
                    </div>
                )}
            </main>

            {/* Booking Confirmation Modal */}
            {showConfirmation && selectedDate && selectedTime && selectedPhysiotherapist && (
                <BookingConfirmation
                    businessName={business.name}
                    physiotherapistName={selectedPhysiotherapist.name}
                    date={selectedDate}
                    time={selectedTime}
                    duration={availability?.defaultDuration || 30}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowConfirmation(false)}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Success Modal */}
            {showSuccess && selectedDate && selectedTime && (
                <BookingSuccess
                    clientName={bookedClientName}
                    businessName={business.name}
                    date={selectedDate}
                    time={selectedTime}
                    onClose={handleSuccessClose}
                />
            )}
        </div>
    );
}
