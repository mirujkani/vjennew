'use client';

interface BookingSuccessProps {
    clientName: string;
    businessName: string;
    date: string;
    time: string;
    onClose: () => void;
}

export default function BookingSuccess({
    clientName,
    businessName,
    date,
    time,
    onClose,
}: BookingSuccessProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                <div className="modal-body">
                    {/* Success Animation */}
                    <div className="success-checkmark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                    </div>

                    <h2 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                        Booking Confirmed!
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                        Thank you, {clientName}! Your appointment has been booked.
                    </p>

                    {/* Appointment Details */}
                    <div
                        className="card"
                        style={{
                            textAlign: 'left',
                            marginBottom: 'var(--space-6)',
                            background: 'rgba(20, 184, 166, 0.05)',
                            border: '1px solid rgba(20, 184, 166, 0.2)',
                        }}
                    >
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
                                    {formatTime(time)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Notice */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-4)',
                            background: 'rgba(37, 211, 102, 0.1)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--space-6)',
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                            A confirmation has been sent to your WhatsApp!
                        </span>
                    </div>

                    <button className="btn btn-primary btn-lg" onClick={onClose} style={{ width: '100%' }}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
