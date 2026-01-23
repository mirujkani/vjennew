'use client';

import { useLanguage } from '@/context/LanguageContext';

interface BookingSuccessProps {
    clientName: string;
    businessName: string;
    specialistName: string;
    date: string;
    time: string;
    onRestart: () => void;
    isWaitlist?: boolean;
}

export default function BookingSuccess({
    clientName,
    onRestart,
    isWaitlist = false,
}: BookingSuccessProps) {
    const { t } = useLanguage();

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ textAlign: 'center' }}>
                <div className="modal-body">
                    {/* Success Animation */}
                    <div className="success-checkmark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                    </div>

                    <h2 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                        {isWaitlist ? t('booking.waitlist_success_title') : t('booking.success_title')}
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                        {isWaitlist ? t('booking.waitlist_success_message') : t('booking.success_message')}
                    </p>

                    <button className="btn btn-primary w-full" onClick={onRestart}>
                        {isWaitlist ? (t('common.close') || 'Close') : t('common.back')}
                    </button>
                </div>
            </div>
        </div>
    );
}
