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
                    Sign In
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
                            No Appointment Left Behind
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
                        The all-in-one platform for your business. Online bookings, automatic WhatsApp notifications, and complete control over your schedule.
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                        <button onClick={() => setShowDemoModal(true)} className="btn btn-primary btn-lg">
                            Book a Demo
                        </button>
                        <Link href="/login" className="btn btn-secondary btn-lg">
                            Get Started
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
                            <div className="badge badge-success mb-4">WhatsApp & SMS Integration</div>
                            <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-3xl)' }}>
                                Notifications & Secure Verification
                            </h2>
                            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
                                Forget SMS and emails that get ignored. Vjen sends automatic confirmations and reminders directly to your client's WhatsApp.
                                For maximum security, we also offer SMS verification.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--space-6)' }}>
                                {[
                                    'Instant confirmation after booking',
                                    'SMS code verification for security',
                                    'Direct and personal communication'
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
                                    Hello! Your appointment has been confirmed for tomorrow at 2:00 PM.
                                </div>
                                <div style={{ alignSelf: 'flex-end', background: '#DCF8C6', padding: 'var(--space-3)', borderRadius: '12px 0 12px 12px', maxWidth: '80%', boxShadow: 'var(--shadow-sm)', filter: 'brightness(0.95)' }}>
                                    Thank you so much! See you then.
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
                        <div className="badge badge-primary mb-4">Smart Scheduling</div>
                        <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
                            Complete Flexibility for Professionals
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            Life happens. Vjen lets you adjust your schedule in seconds, without complications.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--space-8)'
                    }}>
                        <FeatureBox
                            title="Block Time Slots"
                            desc="Have an emergency or lunch break? Block specific time slots with one click and they disappear from your booking page."
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                                </svg>
                            }
                        />
                        <FeatureBox
                            title="Special Dates"
                            desc="Working shorter hours on Friday? Or on holiday? Manage exceptions with ease."
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
                            title="Day Management"
                            desc="Set your working days and standard appointment duration (30min, 45min, 60min) according to your needs."
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
                        How does it work?
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'var(--space-8)',
                        textAlign: 'center'
                    }}>
                        <Step number="1" title="Create Your Profile" desc="Register your business and set your working hours." />
                        <Step number="2" title="Share Your Link" desc="Get your unique link (vjen.al/yourbusiness) and share it with clients." />
                        <Step number="3" title="Accept Bookings" desc="Clients book themselves. You get notified, they get confirmation." />
                        <Step number="4" title="Manage" desc="View calendar, block time slots, and track statistics from the dashboard." />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section style={{ padding: 'var(--space-20) 0', background: 'var(--color-primary-900)', color: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-6)', color: 'white' }}>
                        Ready to modernize your business?
                    </h2>
                    <p style={{ fontSize: 'var(--text-xl)', opacity: 0.8, marginBottom: 'var(--space-10)' }}>
                        Join the professionals who choose Vjen.
                    </p>
                    <button onClick={() => setShowDemoModal(true)} className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--color-primary-600)' }}>
                        Try Free Now
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
