'use client';

import { useState } from 'react';
import { getClientAppointments } from '@/lib/store';
import { Appointment } from '@/lib/types';
import Link from 'next/link';

export default function MyAppointmentsPage() {
    const [phone, setPhone] = useState('');
    const [appointments, setAppointments] = useState<Appointment[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        try {
            const data = await getClientAppointments(phone);
            setAppointments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--space-6)', background: 'var(--bg-primary)' }}>
            <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                    <Link href="/" className="btn btn-ghost mb-4">
                        ← Kthehu
                    </Link>
                    <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
                        Terminet e Mia
                    </h1>
                    <p className="text-secondary">
                        Shkruani numrin tuaj të telefonit për të parë historikun.
                    </p>
                </div>

                <div className="card mb-8">
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Nr. Telefonit (p.sh +383...)"
                            className="form-input"
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Duke kërkuar...' : 'Kërko'}
                        </button>
                    </form>
                </div>

                {searched && appointments && (
                    <div className="animate-fade-in-up">
                        {appointments.length === 0 ? (
                            <div className="text-center p-8 text-secondary">
                                Nuk u gjetën termine për këtë numër.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {appointments.map((apt) => (
                                    <div key={apt.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: 'var(--text-lg)', marginBottom: '4px' }}>
                                                {apt.date} në {apt.time}
                                            </div>
                                            <div className="text-secondary text-sm">
                                                {apt.clientName}
                                            </div>
                                        </div>
                                        <div className={`badge badge-${getStatusColor(apt.status)}`}>
                                            {getStatusLabel(apt.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'confirmed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'error';
        default: return 'primary';
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case 'confirmed': return 'Konfirmuar';
        case 'pending': return 'Në Pritje';
        case 'cancelled': return 'Anuluar';
        case 'completed': return 'Përfunduar';
        default: return status;
    }
}
