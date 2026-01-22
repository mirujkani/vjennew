'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CalendarPicker from '@/components/booking/CalendarPicker';
import TimeSlotGrid from '@/components/booking/TimeSlotGrid';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import BookingSuccess from '@/components/booking/BookingSuccess';
import { BookingFormData, Specialist, Business, Availability, WaitlistEntry, Service } from '@/lib/types';
import { createWaitlistEntry, getBusinessByLink, getSpecialists, getAvailability, generateTimeSlots, createAppointment } from '@/lib/store';
import { useLanguage } from '@/context/LanguageContext';

export default function BookingPage() {
    const params = useParams();
    const businessId = params.businessId as string;
    const { t } = useLanguage();

    const [business, setBusiness] = useState<Business | null>(null);
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
    const [availability, setAvailability] = useState<Availability | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean; reason?: string }[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedWaitlistTimes, setSelectedWaitlistTimes] = useState<string[]>([]);
    const [isWaitlistMode, setIsWaitlistMode] = useState(false);
    const [step, setStep] = useState<'selection' | 'confirmation' | 'waitlist_confirmation' | 'success'>('selection');
    const [lastAppointment, setLastAppointment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Find business by uniqueLink (which is the businessId param in the URL)
                const biz = await getBusinessByLink(businessId);

                if (biz) {
                    const [specs, avail] = await Promise.all([
                        getSpecialists(biz.id),
                        getAvailability(biz.id)
                    ]);

                    setBusiness(biz);
                    setSpecialists(specs);
                    if (specs.length > 0) setSelectedSpecialist(specs[0]);
                    setAvailability(avail);
                }
            } catch (error) {
                console.error('Error loading booking data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [businessId]);

    useEffect(() => {
        if (selectedDate && business) {
            const loadSlots = async () => {
                const slots = await generateTimeSlots(
                    selectedDate,
                    business.id,
                    selectedSpecialist?.id,
                    selectedService?.duration
                );
                setTimeSlots(slots);
            };
            loadSlots();
        }
    }, [selectedDate, business, selectedSpecialist, selectedService]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedTime(''); // Clear time when date changes
    };

    const handleTimeSelect = (timeCode: string) => {
        // timeCode might be "HH:MM-duration" if we support flexible durations
        // For now, let's just handle HH:MM
        setSelectedTime(timeCode);
        setStep('confirmation');
    };

    const handleBookedSlotClick = (time: string) => {
        setIsWaitlistMode(true);
        setSelectedWaitlistTimes(prev =>
            prev.includes(time) ? prev : [...prev, time]
        );
    };

    const handleConfirm = async (formData: BookingFormData) => {
        if (!selectedSpecialist || !business) return;
        setIsSubmitting(true);
        try {
            const appointment = await createAppointment(
                {
                    ...formData,
                    date: selectedDate,
                    time: selectedTime,
                    duration: availability?.defaultDuration || 30,
                    serviceId: selectedService?.id,
                    serviceName: selectedService?.name,
                    servicePrice: selectedService?.price,
                    specialistName: selectedSpecialist?.name,
                },
                selectedSpecialist.id,
                'pending',
                business.id
            );
            setLastAppointment(appointment);
            setStep('success');
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Failed to book appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWaitlistConfirm = async (formData: any) => {
        if (!business) return;
        setIsSubmitting(true);
        try {
            await createWaitlistEntry({
                businessId: business.id,
                clientName: formData.name,
                clientPhone: formData.phone,
                clientEmail: formData.email,
                preferredDates: [selectedDate],
                preferredTimes: selectedWaitlistTimes,
                notes: formData.notes,
            });
            setLastAppointment({ clientName: formData.name }); // For Success screen
            setStep('success');
        } catch (error) {
            console.error('Error joining waitlist:', error);
            alert('Failed to join waitlist. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleWaitlistTime = (time: string) => {
        setSelectedWaitlistTimes(prev =>
            prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
        );
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!business) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)', padding: 'var(--space-6)', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>{t('booking.business_not_found')}</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>{t('booking.link_expired')}</p>
                <Link href="/" className="btn btn-primary">{t('booking.return_home')}</Link>
            </div>
        );
    }

    return (
        <div className="booking-page" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-6)' }}>
                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    {business.logo && (
                        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto var(--space-6)' }}>
                            <img
                                src={business.logo}
                                alt={business.name}
                                style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-xl)', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }}
                            />
                        </div>
                    )}
                    <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>{business.name}</h1>
                    {business.address && (
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {business.address}
                        </p>
                    )}
                    {business.description && (
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', fontSize: 'var(--text-sm)' }}>{business.description}</p>
                    )}
                </header>

                {/* Specialist Selection (only if more than 1) */}
                {specialists.length > 1 && step === 'selection' && (
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>{t('booking.select_specialist')}:</h3>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
                            {specialists.map(spec => (
                                <button
                                    key={spec.id}
                                    onClick={() => setSelectedSpecialist(spec)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-3)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: selectedSpecialist?.id === spec.id ? '2px solid var(--color-primary-500)' : '1px solid var(--border-color)',
                                        background: selectedSpecialist?.id === spec.id ? 'rgba(20, 184, 166, 0.05)' : 'var(--bg-glass)',
                                        minWidth: '120px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{ width: '40px', height: '40px', background: 'var(--gradient-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                        {spec.name.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', whiteSpace: 'nowrap' }}>{spec.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Service Selection */}
                {business.showServices && (business.services || []).length > 0 && step === 'selection' && (
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>{t('booking.select_service')}:</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {(business.services || []).map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => setSelectedService(selectedService?.id === service.id ? null : service)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 'var(--space-3) var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: selectedService?.id === service.id ? '2px solid var(--color-primary-500)' : '1px solid var(--border-color)',
                                        background: selectedService?.id === service.id ? 'rgba(20, 184, 166, 0.08)' : 'var(--bg-glass)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                                            {service.name}
                                        </div>
                                        {service.description && (
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                                {service.description}
                                            </div>
                                        )}
                                    </div>
                                    <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-primary-500)', fontSize: 'var(--text-lg)' }}>
                                        €{service.price.toFixed(2)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Areas */}
                {step === 'selection' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>{t('booking.select_date')}</h2>
                            <div className="card" style={{ padding: 'var(--space-4)' }}>
                                <CalendarPicker
                                    onDateSelect={handleDateSelect}
                                    selectedDate={selectedDate}
                                    workingDays={availability?.workingDays || [1, 2, 3, 4, 5]}
                                />
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="animate-slide-up">
                                <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>{t('booking.select_time')}</h2>
                                <div className="card" style={{ padding: 'var(--space-1)' }}>
                                    <TimeSlotGrid
                                        slots={timeSlots}
                                        onTimeSelect={handleTimeSelect}
                                        onBookedSlotClick={handleBookedSlotClick}
                                        selectedTime={selectedTime}
                                        mode={isWaitlistMode ? 'waitlist' : 'booking'}
                                        selectedTimes={selectedWaitlistTimes}
                                        onToggleTime={toggleWaitlistTime}
                                    />
                                </div>

                                {/* Waitlist Checkbox */}
                                {timeSlots.some(slot => slot.reason === 'booked') && (
                                    <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={isWaitlistMode}
                                                onChange={(e) => {
                                                    setIsWaitlistMode(e.target.checked);
                                                    if (!e.target.checked) setSelectedWaitlistTimes([]);
                                                }}
                                                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-500)' }}
                                            />
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                                                    {t('booking.waitlist_prompt')}
                                                </p>
                                                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                                    {t('booking.waitlist_desc')}
                                                </p>
                                            </div>
                                        </label>

                                        {isWaitlistMode && (
                                            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                                    {selectedWaitlistTimes.length === 0 ? t('booking.waitlist_select_prompt') : t('booking.waitlist_selected')}
                                                </p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                                                    {selectedWaitlistTimes.map(time => (
                                                        <span key={time} className="badge badge-primary" style={{ padding: 'var(--space-1) var(--space-2)' }}>
                                                            {time}
                                                        </span>
                                                    ))}
                                                </div>
                                                {selectedWaitlistTimes.length > 0 && (
                                                    <button
                                                        className="btn btn-primary btn-sm w-full"
                                                        onClick={() => setStep('waitlist_confirmation')}
                                                        style={{ marginTop: 'var(--space-3)' }}
                                                    >
                                                        {t('booking.continue_waitlist')} ({selectedWaitlistTimes.length})
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {step === 'confirmation' && (
                    <BookingConfirmation
                        businessName={business.name}
                        specialistName={selectedSpecialist?.name || ''}
                        date={selectedDate}
                        time={selectedTime}
                        duration={availability?.defaultDuration || 30}
                        onConfirm={handleConfirm}
                        onCancel={() => setStep('selection')}
                        isSubmitting={isSubmitting}
                        serviceName={selectedService?.name}
                        servicePrice={selectedService?.price}
                    />
                )}

                {step === 'waitlist_confirmation' && (
                    <BookingConfirmation
                        isWaitlist
                        businessName={business.name}
                        specialistName={selectedSpecialist?.name || ''}
                        date={selectedDate}
                        time={selectedWaitlistTimes.join(', ')}
                        duration={0}
                        onConfirm={handleWaitlistConfirm}
                        onCancel={() => setStep('selection')}
                        isSubmitting={isSubmitting}
                    />
                )}

                {step === 'success' && lastAppointment && (
                    <BookingSuccess
                        businessName={business.name}
                        specialistName={selectedSpecialist?.name || ''}
                        date={lastAppointment.date}
                        time={lastAppointment.time}
                        clientName={lastAppointment.clientName}
                        onRestart={() => {
                            setStep('selection');
                            setSelectedTime('');
                            setSelectedWaitlistTimes([]);
                            setIsWaitlistMode(false);
                            setLastAppointment(null);
                        }}
                    />
                )}

                {/* Footer Info */}
                <footer style={{ marginTop: 'var(--space-12)', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-6)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                        {t('common.powered_by')} <a href="#" style={{ color: 'var(--color-primary-400)', textDecoration: 'none', fontWeight: 'bold' }}>Vjen</a>
                    </p>
                </footer>
            </div>
        </div>
    );
}
