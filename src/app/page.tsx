'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBusiness } from '@/lib/store';
import { Business } from '@/lib/types';
import DemoModal from '@/components/landing/DemoModal';

export default function HomePage() {
    const [business, setBusiness] = useState<Business | null>(null);
    const [showDemoModal, setShowDemoModal] = useState(false);

    useEffect(() => {
        getBusiness().then(setBusiness).catch(console.error);
    }, []);

    return (
        <main>
            {/* Header / Sign In */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: 'var(--space-4) var(--space-6)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 50,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border-color)',
            }}>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-primary-600)' }}>
                    Vjen
                </div>
                <Link href="/login" className="btn btn-secondary btn-sm">
                    Kyçuni
                </Link>
            </div>

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-6)',
                background: 'var(--gradient-hero)',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
            }}>
                <div className="container animate-fade-in-up">
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: '800',
                        lineHeight: '1.1',
                        marginBottom: 'var(--space-6)',
                        color: 'var(--text-primary)',
                        maxWidth: '900px',
                        margin: '0 auto var(--space-6)',
                    }}>
                        <span style={{
                            background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Asnjë termin i humbur
                        </span>
                    </h1>

                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-10)',
                        maxWidth: '600px',
                        margin: '0 auto var(--space-10)',
                        lineHeight: '1.6',
                    }}>
                        Platforma gjithëpërfshirëse për biznesin tuaj. Rezervime online, njoftime automatike në WhatsApp, dhe kontroll i plotë mbi orarin tuaj.
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                        <button onClick={() => setShowDemoModal(true)} className="btn btn-primary btn-lg">
                            Rezervo Demo
                        </button>
                        <Link href="/login" className="btn btn-secondary btn-lg">
                            Fillo Tani
                        </Link>
                    </div>
                </div>
            </section>

            {/* WhatsApp Integration Section */}
            <section style={{ padding: 'var(--space-20) 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'var(--space-12)',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div className="badge badge-success mb-4">Integrim WhatsApp & SMS</div>
                            <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-3xl)' }}>
                                Njoftime & Verifikim i Sigurt
                            </h2>
                            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
                                Harrojini SMS-të dhe email-et që injorohen. Vjen dërgon konfirmime dhe rikujtime automatike direkt në WhatsApp-in e klientit.
                                Për siguri maksimale, ofrojmë edhe verifikim me SMS.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--space-6)' }}>
                                {[
                                    'Konfirmim i menjëhershëm pas rezervimit',
                                    'Verifikim me kod SMS për siguri',
                                    'Komunikim i drejtpërdrejtë dhe personal'
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                        <div style={{ color: 'var(--color-success-500)' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card" style={{
                            background: '#dcf8c6',
                            border: 'none',
                            transform: 'rotate(-2deg)',
                            boxShadow: 'var(--shadow-xl)'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div style={{ alignSelf: 'flex-start', background: 'white', padding: 'var(--space-3)', borderRadius: '0 12px 12px 12px', maxWidth: '80%', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', marginBottom: '4px' }}>Vjen Bot</div>
                                    Përshëndetje! Termini juaj u konfirmua për nesër në ora 14:00.
                                </div>
                                <div style={{ alignSelf: 'flex-end', background: '#DCF8C6', padding: 'var(--space-3)', borderRadius: '12px 0 12px 12px', maxWidth: '80%', boxShadow: 'var(--shadow-sm)', filter: 'brightness(0.95)' }}>
                                    Faleminderit shumë! Shihemi.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Smart Scheduling Section */}
            <section style={{ padding: 'var(--space-20) 0', background: 'var(--bg-primary)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                        <div className="badge badge-primary mb-4">Orari i Mençur</div>
                        <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
                            Fleksibilitet i Plotë për Profesionistë
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            Jeta ndodh. Vjen ju lejon të përshtatni orarin tuaj në sekonda, pa komplikime.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--space-8)'
                    }}>
                        <FeatureBox
                            title="Blloko Orarin"
                            desc="Keni një urgjencë apo pauzë dreke? Bllokoni orare specifike me një klikim dhe ato zhduken nga faqja e rezervimit."
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                                </svg>
                            }
                        />
                        <FeatureBox
                            title="Data Speciale"
                            desc="Punoni me orar të shkurtër të Premten? Apo jeni pushim për festa? Menaxhoni përjashtimet me lehtësi."
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            }
                        />
                        <FeatureBox
                            title="Menaxhimi i Ditëve"
                            desc="Caktoni ditët e punës dhe kohëzgjatjen standarde të termineve (30min, 45min, 60min) sipas nevojës suaj."
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: 'var(--space-20) 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="text-center" style={{ marginBottom: 'var(--space-16)', fontSize: 'var(--text-3xl)' }}>
                        Si funksionon?
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'var(--space-8)',
                        textAlign: 'center'
                    }}>
                        <Step number="1" title="Krijo Profilin" desc="Regjistro biznesin dhe cakto orarin tënd të punës." />
                        <Step number="2" title="Ndaj Linkun" desc="Merr linkun tënd unik (vjen.al/biznesijuaj) dhe dërgoja klientëve." />
                        <Step number="3" title="Prano Rezervime" desc="Klientët rezervojnë vetë. Ti merr njoftim, ata marrin konfirmim." />
                        <Step number="4" title="Menaxho" desc="Shiko kalendarin, blloko orare, dhe ndiq statistikat nga paneli." />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section style={{ padding: 'var(--space-20) 0', background: 'var(--color-primary-900)', color: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-6)', color: 'white' }}>
                        Gati për të modernizuar biznesin tuaj?
                    </h2>
                    <p style={{ fontSize: 'var(--text-xl)', opacity: 0.8, marginBottom: 'var(--space-10)' }}>
                        Bashkohuni me profesionistët që zgjedhin Vjen.
                    </p>
                    <button onClick={() => setShowDemoModal(true)} className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--color-primary-600)' }}>
                        Provo Falas Tani
                    </button>
                </div>
            </section>

            {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}
        </main>
    );
}

function FeatureBox({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="card" style={{ padding: 'var(--space-8)', transition: 'transform 0.2s' }}>
            <div style={{
                width: '56px', height: '56px',
                background: 'var(--color-primary-50)',
                color: 'var(--color-primary-600)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'var(--space-6)'
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
                width: '48px', height: '48px',
                borderRadius: '50%',
                background: 'var(--color-primary-100)',
                color: 'var(--color-primary-700)',
                fontWeight: 'bold', fontSize: 'var(--text-xl)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'var(--space-4)'
            }}>
                {number}
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{desc}</p>
        </div>
    );
}
