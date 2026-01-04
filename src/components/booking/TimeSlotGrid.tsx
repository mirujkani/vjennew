'use client';

interface TimeSlotGridProps {
    slots: { time: string; available: boolean }[];
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
}

export default function TimeSlotGrid({
    slots,
    selectedTime,
    onTimeSelect,
}: TimeSlotGridProps) {
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
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
                    No available time slots for this day.
                </p>
            </div>
        );
    }

    const availableSlots = slots.filter(slot => slot.available);

    if (availableSlots.length === 0) {
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
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                    All time slots are booked for this day.
                </p>
            </div>
        );
    }

    return (
        <div className="time-slots">
            {slots.map((slot, index) => (
                <button
                    key={slot.time}
                    className={`time-slot ${!slot.available ? 'time-slot-disabled' : ''
                        } ${selectedTime === slot.time ? 'time-slot-selected' : ''
                        }`}
                    onClick={() => slot.available && onTimeSelect(slot.time)}
                    disabled={!slot.available}
                    style={{
                        animationDelay: `${index * 30}ms`,
                    }}
                >
                    {formatTime(slot.time)}
                </button>
            ))}
        </div>
    );
}
