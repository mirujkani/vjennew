import { useState, useEffect } from 'react';
import { generateTimeSlots } from '@/lib/store';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface AvailableSlotsViewerProps {
    onClose: () => void;
    onSlotSelect: (date: string, time: string) => void;
}

export default function AvailableSlotsViewer({ onClose, onSlotSelect }: AvailableSlotsViewerProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
    const [loading, setLoading] = useState(false);

    const loadSlots = async (selectedDate: Date) => {
        setLoading(true);
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const data = await generateTimeSlots(dateStr);
            setSlots(data);
        } catch (error) {
            console.error('Error loading slots:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSlots(date);
    }, [date]);

    // Custom tile content to show dot for today
    const tileContent = ({ date: d, view }: { date: Date; view: string }) => {
        if (view === 'month' && d.toDateString() === new Date().toDateString()) {
            return <div className="calendar-dot" />;
        }
        return null;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
                <div className="modal-header">
                    <h3 style={{ margin: 0 }}>Orari i Lirë</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <div className="calendar-wrapper">
                            <Calendar
                                onChange={(value) => setDate(value as Date)}
                                value={date}
                                locale="sq-AL"
                                minDate={new Date()}
                                tileContent={tileContent}
                                prevLabel={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>}
                                nextLabel={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>
                            {date.toLocaleDateString('sq-AL', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h4>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                                <div className="spinner" />
                            </div>
                        ) : (
                            <div className="slots-grid">
                                {slots.length > 0 ? (
                                    slots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            className={`slot-item ${!slot.available ? 'disabled' : ''}`}
                                            disabled={!slot.available}
                                            onClick={() => slot.available && onSlotSelect(date.toISOString().split('T')[0], slot.time)}
                                            style={{
                                                position: 'relative',
                                                opacity: slot.available ? 1 : 0.5,
                                                cursor: slot.available ? 'pointer' : 'not-allowed',
                                            }}
                                        >
                                            {slot.time}
                                            {!slot.available && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                                                    fontSize: '10px',
                                                    color: 'var(--color-error-500)',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    background: 'rgba(255,255,255,0.8)',
                                                    padding: '2px 4px',
                                                    borderRadius: '4px'
                                                }}>
                                                    Zënë
                                                </span>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                                        Nuk ka orare për këtë ditë.
                                    </div>
                                )}
                            </div>
                        )}
                        <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                            <p>Klikoni një orar të lirë për të caktuar termin.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
