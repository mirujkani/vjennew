'use client';

import { useState, useEffect } from 'react';
import { getAvailability, updateAvailability, getAvailabilityOverrides, setAvailabilityOverride, deleteAvailabilityOverride } from '@/lib/store';
import { Availability, AvailabilityOverride } from '@/lib/types';
import BlockTimeModal from '@/components/dashboard/BlockTimeModal';

const dayNames = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];

export default function AvailabilityPage() {
    const [availability, setAvailabilityState] = useState<Availability | null>(null);
    const [overrides, setOverrides] = useState<AvailabilityOverride[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showOverrideForm, setShowOverrideForm] = useState(false);
    const [showBlockTimeModal, setShowBlockTimeModal] = useState(false);
    const [newOverride, setNewOverride] = useState<{
        date: string;
        isOff: boolean;
        startTime: string;
        endTime: string;
    }>({
        date: '',
        isOff: true,
        startTime: '09:00',
        endTime: '17:00'
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [availData, overridesData] = await Promise.all([
                    getAvailability(),
                    getAvailabilityOverrides()
                ]);
                setAvailabilityState(availData);
                setOverrides(overridesData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const toggleDay = (dayIndex: number) => {
        if (!availability) return;
        setAvailabilityState({
            ...availability,
            workingDays: availability.workingDays.includes(dayIndex)
                ? availability.workingDays.filter(d => d !== dayIndex)
                : [...availability.workingDays, dayIndex].sort(),
        });
    };

    const toggleDuration = (duration: number) => {
        if (!availability) return;
        setAvailabilityState({
            ...availability,
            appointmentDurations: availability.appointmentDurations.includes(duration)
                ? availability.appointmentDurations.filter(d => d !== duration)
                : [...availability.appointmentDurations, duration].sort((a, b) => a - b),
        });
    };

    const handleSave = async () => {
        if (!availability) return;
        setIsSaving(true);
        try {
            await updateAvailability(availability);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving availability:', error);
            alert('Dështoi ruajtja e orarit');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveOverride = async () => {
        if (!newOverride.date) {
            alert('Ju lutem zgjidhni një datë');
            return;
        }

        try {
            await setAvailabilityOverride({
                ...newOverride,
            });
            setShowOverrideForm(false);
            setNewOverride({
                date: '',
                isOff: true,
                startTime: '09:00',
                endTime: '17:00'
            });
            // Reload overrides
            const updated = await getAvailabilityOverrides();
            setOverrides(updated);
        } catch (error) {
            console.error('Error saving override:', error);
            alert('Dështoi ruajtja e datës speciale');
        }
    };

    const handleDeleteOverride = async (id: string) => {
        if (!confirm('A jeni të sigurt?')) return;
        try {
            await deleteAvailabilityOverride(id);
            const updated = await getAvailabilityOverrides();
            setOverrides(updated);
        } catch (error) {
            console.error('Error deleting override:', error);
        }
    };

    if (isLoading || !availability) {
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
                <h1 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>Cilësimet e Orarit</h1>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-secondary" onClick={() => setShowBlockTimeModal(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 'var(--space-2)' }}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                        </svg>
                        Blloko Orarin
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner" style={{ width: '16px', height: '16px' }} />
                                Duke ruajtur...
                            </>
                        ) : saved ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                                U ruajt!
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                    <polyline points="17,21 17,13 7,13 7,21" />
                                    <polyline points="7,3 7,8 15,8" />
                                </svg>
                                Ruaj Ndryshimet
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Working Days */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Ditët e Punës</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Zgjidhni ditët kur jeni në dispozicion për termine.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 'var(--space-3)',
                }}>
                    {dayNames.map((day, index) => (
                        <button
                            key={day}
                            onClick={() => toggleDay(index)}
                            style={{
                                padding: 'var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                border: availability.workingDays.includes(index)
                                    ? '2px solid var(--color-primary-500)'
                                    : '1px solid var(--border-color)',
                                background: availability.workingDays.includes(index)
                                    ? 'rgba(20, 184, 166, 0.1)'
                                    : 'var(--bg-glass)',
                                color: availability.workingDays.includes(index)
                                    ? 'var(--color-primary-400)'
                                    : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                fontWeight: 'var(--font-medium)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Working Hours */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Orari i Punës</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Caktoni orarin tuaj ditor të punës.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-6)',
                }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="startTime">Koha e Fillimit</label>
                        <input
                            id="startTime"
                            type="time"
                            className="form-input"
                            value={availability.startTime}
                            onChange={(e) => setAvailabilityState({ ...availability, startTime: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="endTime">Koha e Mbarimit</label>
                        <input
                            id="endTime"
                            type="time"
                            className="form-input"
                            value={availability.endTime}
                            onChange={(e) => setAvailabilityState({ ...availability, endTime: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Break Time */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Koha e Pushimit</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Caktoni kohën e pushimit. Asnjë termin nuk do të caktohet gjatë kësaj periudhe.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-6)',
                }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="breakStart">Fillimi i Pushimit</label>
                        <input
                            id="breakStart"
                            type="time"
                            className="form-input"
                            value={availability.breakStart || ''}
                            onChange={(e) => setAvailabilityState({ ...availability, breakStart: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="breakEnd">Mbarimi i Pushimit</label>
                        <input
                            id="breakEnd"
                            type="time"
                            className="form-input"
                            value={availability.breakEnd || ''}
                            onChange={(e) => setAvailabilityState({ ...availability, breakEnd: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Appointment Durations */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Kohëzgjatja e Termineve</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Menaxhoni kohëzgjatjet e termineve që ofroni.
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <input
                            type="number"
                            placeholder="Min"
                            className="form-input"
                            style={{ width: '100px' }}
                            id="newDurationInput"
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                const input = document.getElementById('newDurationInput') as HTMLInputElement;
                                const val = parseInt(input.value);
                                if (val > 0 && !availability.appointmentDurations.includes(val)) {
                                    toggleDuration(val);
                                    input.value = '';
                                }
                            }}
                        >
                            + Shto
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
                    {availability.appointmentDurations.map((duration) => (
                        <div
                            key={duration}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                padding: 'var(--space-2) var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-primary-500)',
                                background: 'rgba(20, 184, 166, 0.1)',
                                color: 'var(--color-primary-600)',
                                fontWeight: 'var(--font-medium)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            {duration} min
                            <button
                                onClick={() => toggleDuration(duration)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-primary-600)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="form-group" style={{ margin: 0, maxWidth: '300px' }}>
                    <label className="form-label" htmlFor="defaultDuration">Kohëzgjatja e parazgjedhur</label>
                    <select
                        id="defaultDuration"
                        className="form-input form-select"
                        value={availability.defaultDuration}
                        onChange={(e) => setAvailabilityState({ ...availability, defaultDuration: parseInt(e.target.value) })}
                    >
                        {availability.appointmentDurations.map((duration) => (
                            <option key={duration} value={duration}>
                                {duration} minuta
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Special Dates */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-lg)' }}>Data Speciale</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                            Caktoni ditë pushimi ose orare të ndryshme për data specifike.
                        </p>
                    </div>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setShowOverrideForm(!showOverrideForm)}
                    >
                        {showOverrideForm ? 'Anulo' : '+ Shto Datë'}
                    </button>
                </div>

                {showOverrideForm && (
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Data</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={newOverride.date}
                                    onChange={(e) => setNewOverride({ ...newOverride, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Lloji</label>
                                <select
                                    className="form-input form-select"
                                    value={newOverride.isOff ? 'off' : 'custom'}
                                    onChange={(e) => setNewOverride({ ...newOverride, isOff: e.target.value === 'off' })}
                                >
                                    <option value="off">Ditë Pushimi</option>
                                    <option value="custom">Orar Ndryshe</option>
                                </select>
                            </div>
                        </div>

                        {!newOverride.isOff && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Fillimi</label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={newOverride.startTime}
                                        onChange={(e) => setNewOverride({ ...newOverride, startTime: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Mbarimi</label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={newOverride.endTime}
                                        onChange={(e) => setNewOverride({ ...newOverride, endTime: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary btn-sm" onClick={handleSaveOverride}>
                                Ruaj
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {overrides.length === 0 ? (
                        <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            Nuk ka data speciale të caktuara
                        </div>
                    ) : (
                        overrides.map((override) => (
                            <div key={override.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'var(--space-3)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                                        {new Date(override.date).toLocaleDateString('sq-AL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-500)' }}>
                                        {override.isOff ? 'Ditë Pushimi' : `${override.startTime} - ${override.endTime}`}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleDeleteOverride(override.id)}
                                    style={{ color: 'var(--color-error-500)', padding: 'var(--space-2)' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Preview */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, transparent 100%)',
            }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Përmbledhja e Orarit</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 'var(--space-4)',
                }}>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                            Ditët e Punës
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                            {availability.workingDays.length === 0
                                ? 'Asnjë ditë e zgjedhur'
                                : availability.workingDays.map(d => dayNames[d].slice(0, 3)).join(', ')}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                            Orari i Punës
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                            {availability.startTime} - {availability.endTime}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                            Koha e Pushimit
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                            {availability.breakStart && availability.breakEnd
                                ? `${availability.breakStart} - ${availability.breakEnd}`
                                : 'Pa caktuar'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                            Termini Standard
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                            {availability.defaultDuration} minuta
                        </div>
                    </div>
                </div>
            </div>

            {showBlockTimeModal && (
                <BlockTimeModal
                    onClose={() => setShowBlockTimeModal(false)}
                    onSuccess={() => {
                        // Success handled by modal
                    }}
                />
            )}
        </div>
    );
}
