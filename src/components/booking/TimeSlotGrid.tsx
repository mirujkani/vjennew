'use client';

interface TimeSlotGridProps {
    slots: { time: string; available: boolean; reason?: string }[];
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
    mode?: 'booking' | 'waitlist';
    selectedTimes?: string[];
    onToggleTime?: (time: string) => void;
    onBookedSlotClick?: (time: string) => void;
}

export default function TimeSlotGrid({
    slots,
    selectedTime,
    onTimeSelect,
    mode = 'booking',
    selectedTimes = [],
    onToggleTime,
    onBookedSlotClick,
}: TimeSlotGridProps) {
    const formatTime = (time: string) => {
        return time;
    };

    if (slots.length === 0) {
        return (
            <div style={{
                padding: 'var(--space-8)',
                textAlign: 'center',
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
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                </svg>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                    Nuk ka orare për këtë ditë.
                </p>
            </div>
        );
    }

    const availableSlots = slots.filter(slot => slot.available);
    const bookedSlots = slots.filter(slot => slot.reason === 'booked');

    if (mode === 'booking' && availableSlots.length === 0) {
        // Find if there are ANY slots total (to decide whether to show waitlist option)
        if (slots.length > 0) {
            return (
                <div style={{
                    padding: 'var(--space-8)',
                    textAlign: 'center',
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
                        <line x1="9" y1="14" x2="15" y2="20" />
                        <line x1="15" y1="14" x2="9" y2="20" />
                    </svg>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                        Të gjitha oraret janë të rezervuara për këtë ditë.
                    </p>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        Mund të regjistroheni në listën e pritjes më poshtë.
                    </div>
                </div>
            );
        }
    }

    const slotsToShow = mode === 'waitlist' ? bookedSlots : slots;

    if (mode === 'waitlist' && bookedSlots.length === 0) {
        return (
            <div style={{
                padding: 'var(--space-6)',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
            }}>
                Nuk ka orare të rezervuara për të cilat mund të njoftoheni.
            </div>
        );
    }

    return (
        <div className="time-slots">
            {slotsToShow.map((slot, index) => {
                const isSelected = mode === 'waitlist'
                    ? selectedTimes.includes(slot.time)
                    : selectedTime === slot.time;

                const isBooked = slot.reason === 'booked';
                const isDisabled = mode === 'booking' && !slot.available && !isBooked;

                return (
                    <button
                        key={slot.time}
                        className={`time-slot ${isDisabled ? 'time-slot-disabled' : ''} ${isBooked && mode === 'booking' ? 'time-slot-booked' : ''} ${isSelected ? 'time-slot-selected' : ''}`}
                        onClick={() => {
                            if (mode === 'waitlist') {
                                onToggleTime?.(slot.time);
                            } else if (isBooked) {
                                onBookedSlotClick?.(slot.time);
                            } else if (!isDisabled) {
                                onTimeSelect(slot.time);
                            }
                        }}
                        disabled={isDisabled}
                        style={{
                            animationDelay: `${index * 30}ms`,
                        }}
                    >
                        {formatTime(slot.time)}
                    </button>
                );
            })}
        </div>
    );
}
