'use client';

interface BookingSuccessProps {
    clientName: string;
    businessName: string;
    specialistName: string;
    date: string;
    time: string;
    onRestart: () => void;
}

export default function BookingSuccess({
    clientName,
    onRestart,
}: BookingSuccessProps) {
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
                        Kërkesa u dërgua me sukses
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                        Faleminderit, {clientName}! Kërkesa juaj është dërguar dhe do të njoftoheni së shpejti.
                    </p>

                    <button className="btn btn-primary w-full" onClick={onRestart}>
                        Mbyll
                    </button>
                </div>
            </div>
        </div>
    );
}
