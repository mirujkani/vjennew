import { useState } from 'react';
import { AvailabilityOverride } from '@/lib/types';
import { setAvailabilityOverride } from '@/lib/store';

interface SpecialDatesManagerProps {
    overrides: AvailabilityOverride[];
    onUpdate: () => void;
}

export default function SpecialDatesManager({ overrides, onUpdate }: SpecialDatesManagerProps) {
    const [showAdd, setShowAdd] = useState(false);
    const [newOverride, setNewOverride] = useState<{ date: string; startTime: string; endTime: string; isOff: boolean }>({
        date: '',
        startTime: '09:00',
        endTime: '17:00',
        isOff: true,
    });

    const handleSave = async () => {
        if (!newOverride.date) return;

        try {
            await setAvailabilityOverride(newOverride);
            onUpdate();
            setShowAdd(false);
            setNewOverride({ date: '', startTime: '09:00', endTime: '17:00', isOff: true });
        } catch (error) {
            console.error('Error saving override:', error);
            alert('Gabim gjatë ruajtjes');
        }
    };

    return (
        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-4)',
            }}>
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Datat Speciale</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAdd(true)}>
                    + Shto Datë
                </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                Caktoni ditë pushimi ose orare të ndryshme për data specifike (p.sh. festa).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {overrides.length === 0 && !showAdd && (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 'var(--text-sm)' }}>
                        Nuk keni caktuar asnjë datë speciale.
                    </div>
                )}

                {overrides
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map(override => (
                        <div key={override.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--space-3)',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <span style={{ fontWeight: 'bold' }}>
                                    {new Date(override.date).toLocaleDateString('sq-AL', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                {override.isOff ? (
                                    <span className="badge" style={{ background: 'var(--color-error-500)', color: 'white' }}>Pushim</span>
                                ) : (
                                    <span className="badge" style={{ background: 'var(--color-primary-500)', color: 'white' }}>
                                        {override.startTime} - {override.endTime}
                                    </span>
                                )}
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                title="Ndrysho"
                                onClick={() => {
                                    setNewOverride({
                                        date: override.date,
                                        startTime: override.startTime,
                                        endTime: override.endTime,
                                        isOff: override.isOff
                                    });
                                    setShowAdd(true);
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                        </div>
                    ))}
            </div>

            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">Shto/Ndrysho Datë Speciale</h3>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Data</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={newOverride.date}
                                    onChange={e => setNewOverride({ ...newOverride, date: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="radio-label">
                                    <input
                                        type="checkbox"
                                        checked={newOverride.isOff}
                                        onChange={e => setNewOverride({ ...newOverride, isOff: e.target.checked })}
                                    />
                                    Është ditë pushimi?
                                </label>
                            </div>

                            {!newOverride.isOff && (
                                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Fillimi</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={newOverride.startTime}
                                            onChange={e => setNewOverride({ ...newOverride, startTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Mbarimi</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={newOverride.endTime}
                                            onChange={e => setNewOverride({ ...newOverride, endTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Anulo</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={!newOverride.date}>Ruaj</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
