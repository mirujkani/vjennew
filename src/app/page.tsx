'use client';

import { useState } from 'react';
import Link from 'next/link';
import DemoModal from '@/components/landing/DemoModal';

export default function HomePage() {
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <main style={{ background: 'var(--bg-primary)' }}>
            {/* Header */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: 'var(--space-4) var(--space-8)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                    <Link href="/" style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--color-primary-600)', textDecoration: 'none' }}>
                        Vjen
                    </Link>
                    <nav style={{ display: 'flex', gap: 'var(--space-6)' }}>
                        <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '500' }}>Features</a>
                        <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '500' }}>How It Works</a>
                        <a href="#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '500' }}>FAQ</a>
                    </nav>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '500', padding: 'var(--space-2) var(--space-4)' }}>
                        Sign In
                    </Link>
                    <Link href="/login" className="btn btn-primary btn-sm">
                        Start Free
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '120px var(--space-8) var(--space-16)',
                background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                }} />
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
                    <div>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            background: 'rgba(20, 184, 166, 0.1)',
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: '100px',
                            marginBottom: 'var(--space-6)',
                        }}>
                            <span style={{ width: '8px', height: '8px', background: 'var(--color-primary-500)', borderRadius: '50%' }} />
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-700)', fontWeight: '600' }}>Appointment Scheduling Software</span>
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: '800',
                            lineHeight: '1.1',
                            marginBottom: 'var(--space-6)',
                            color: 'var(--text-primary)',
                        }}>
                            Eliminate
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Scheduling Chaos
                            </span>
                        </h1>
                        <p style={{
                            fontSize: 'var(--text-lg)',
                            color: 'var(--text-secondary)',
                            marginBottom: 'var(--space-8)',
                            lineHeight: '1.7',
                            maxWidth: '500px',
                        }}>
                            Don't waste time arranging meetings with clients. Streamline your business workflow with automated bookings, smart reminders, and seamless client management.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                            <Link href="/login" className="btn btn-primary btn-lg" style={{ padding: 'var(--space-4) var(--space-8)' }}>
                                Start for Free
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'var(--space-2)' }}>
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <button onClick={() => setShowDemoModal(true)} className="btn btn-secondary btn-lg" style={{ padding: 'var(--space-4) var(--space-8)' }}>
                                Book a Demo
                            </button>
                        </div>
                        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-8)' }}>
                            <div>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-primary-600)' }}>80%</div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Time saved</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-primary-600)' }}>24/7</div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Online booking</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-primary-600)' }}>0</div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>No-shows</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            background: 'white',
                            borderRadius: 'var(--radius-2xl)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                            padding: 'var(--space-6)',
                            transform: 'perspective(1000px) rotateY(-5deg)',
                        }}>
                            {/* Mock Calendar UI */}
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                    <span style={{ fontWeight: '600' }}>January 2026</span>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</div>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--space-1)', textAlign: 'center', fontSize: 'var(--text-xs)' }}>
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                        <div key={i} style={{ color: 'var(--text-muted)', padding: 'var(--space-1)' }}>{d}</div>
                                    ))}
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <div key={i} style={{
                                            padding: 'var(--space-2)',
                                            borderRadius: 'var(--radius-md)',
                                            background: i === 19 ? 'var(--color-primary-500)' : 'transparent',
                                            color: i === 19 ? 'white' : 'var(--text-primary)',
                                            fontWeight: i === 19 ? '600' : '400',
                                        }}>{i + 1}</div>
                                    ))}
                                </div>
                            </div>
                            {/* Mock appointments */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {[
                                    { time: '09:00', name: 'Sarah Johnson', color: '#10b981' },
                                    { time: '10:30', name: 'Mike Peters', color: '#8b5cf6' },
                                    { time: '14:00', name: 'Emma Wilson', color: '#f59e0b' },
                                ].map((apt, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: `3px solid ${apt.color}`,
                                    }}>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-muted)' }}>{apt.time}</span>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{apt.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: 'var(--space-20) var(--space-8)', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
                        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>
                            Schedules on Autopilot
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'var(--text-lg)' }}>
                            Save up to 80% of operational time with automatic booking and reminder management.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)' }}>
                        <FeatureCard
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                            title="Simple Bookings"
                            description="Clients book themselves 24/7 through your personalized booking page. No more phone tag or back-and-forth emails."
                        />
                        <FeatureCard
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>}
                            title="Smart Reminders"
                            description="Automatic WhatsApp and SMS notifications keep clients informed. Reduce no-shows by up to 90%."
                        />
                        <FeatureCard
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                            title="Real-time Calendar"
                            description="Your schedule updates instantly. Block time slots, set working hours, and manage availability with ease."
                        />
                        <FeatureCard
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                            title="Secure Verification"
                            description="Phone verification ensures real bookings. Say goodbye to fake appointments and spam."
                        />
                    </div>
                </div>
            </section>

            {/* Booking Page Feature */}
            <section style={{ padding: 'var(--space-20) var(--space-8)', background: 'var(--bg-secondary)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
                    <div>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(139, 92, 246, 0.1)',
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: '100px',
                            marginBottom: 'var(--space-4)',
                        }}>
                            <span style={{ fontSize: 'var(--text-sm)', color: '#8b5cf6', fontWeight: '600' }}>Booking Pages</span>
                        </div>
                        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>
                            Your Own Professional Booking Page
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)', lineHeight: '1.7' }}>
                            Get a beautiful, mobile-friendly booking page that's ready to share in minutes. Customize it to match your brand.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {[
                                'Personalized URL (vjen.al/yourbusiness)',
                                'Mobile-optimized design',
                                'Service and specialist selection',
                                'Instant confirmation and reminders',
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: 'rgba(20, 184, 166, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary-600)',
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-2xl)',
                        boxShadow: 'var(--shadow-xl)',
                        padding: 'var(--space-6)',
                        transform: 'perspective(1000px) rotateY(5deg)',
                    }}>
                        {/* Mock Booking Page */}
                        <div style={{ background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary-500)', margin: '0 auto var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--text-xl)', fontWeight: '700' }}>S</div>
                            <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>Smile Dental Clinic</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Select a service to book</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {['Dental Checkup', 'Teeth Cleaning', 'Consultation'].map((service, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 'var(--space-3)',
                                    background: i === 0 ? 'rgba(20, 184, 166, 0.1)' : 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: i === 0 ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                                    cursor: 'pointer',
                                }}>
                                    <span style={{ fontWeight: '500' }}>{service}</span>
                                    <span style={{ fontWeight: '600', color: 'var(--color-primary-600)' }}>€{30 + i * 20}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Management & Dashboard */}
            <section style={{ padding: 'var(--space-20) var(--space-8)', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--space-6)',
                        color: 'white',
                    }}>
                        {/* Mock Dashboard */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                            <span style={{ fontWeight: '600' }}>Dashboard</span>
                            <span style={{ fontSize: 'var(--text-sm)', opacity: 0.7 }}>Today, Jan 20</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                            {[
                                { label: 'Today', value: '8' },
                                { label: 'This Week', value: '32' },
                                { label: 'Clients', value: '156' },
                            ].map((stat, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700' }}>{stat.value}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                            <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', opacity: 0.7 }}>Upcoming</div>
                            {[
                                { time: '09:00', name: 'Sarah J.' },
                                { time: '10:30', name: 'Mike P.' },
                            ].map((apt, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                    <span>{apt.name}</span>
                                    <span style={{ opacity: 0.7 }}>{apt.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(20, 184, 166, 0.1)',
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: '100px',
                            marginBottom: 'var(--space-4)',
                        }}>
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-700)', fontWeight: '600' }}>Dashboard</span>
                        </div>
                        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>
                            Complete Control at Your Fingertips
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)', lineHeight: '1.7' }}>
                            Manage appointments, track performance, and grow your business with powerful insights.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            {[
                                { icon: '📅', text: 'Appointment calendar' },
                                { icon: '👥', text: 'Client management' },
                                { icon: '⏰', text: 'Availability settings' },
                                { icon: '📊', text: 'Business analytics' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{ fontSize: 'var(--text-xl)' }}>{item.icon}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" style={{ padding: 'var(--space-20) var(--space-8)', background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
                        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>
                            Get Started in Minutes
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
                            Four simple steps to transform your scheduling
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-8)' }}>
                        {[
                            { step: '1', title: 'Create Profile', desc: 'Sign up and add your business details' },
                            { step: '2', title: 'Set Schedule', desc: 'Configure working hours and services' },
                            { step: '3', title: 'Share Link', desc: 'Get your unique booking URL' },
                            { step: '4', title: 'Accept Bookings', desc: 'Clients book, you get notified' },
                        ].map((item, i) => (
                            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                                {i < 3 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '24px',
                                        left: '60%',
                                        width: '80%',
                                        height: '2px',
                                        background: 'linear-gradient(90deg, var(--color-primary-300), transparent)',
                                    }} />
                                )}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'var(--color-primary-500)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: 'var(--text-lg)',
                                    margin: '0 auto var(--space-4)',
                                    position: 'relative',
                                    zIndex: 1,
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--space-2)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" style={{ padding: 'var(--space-20) var(--space-8)', background: 'white' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {[
                            { q: 'What is Vjen?', a: 'Vjen is an all-in-one appointment scheduling platform that helps businesses automate their booking process. Clients can book appointments 24/7 through your personalized booking page, and both parties receive automatic confirmations via WhatsApp or SMS.' },
                            { q: 'Who can use Vjen?', a: 'Vjen is perfect for any service-based business: salons, clinics, consultants, therapists, coaches, fitness instructors, and more. If you take appointments, Vjen is for you.' },
                            { q: 'How do clients book appointments?', a: 'You get a unique booking link (vjen.al/yourbusiness) that you can share anywhere. Clients visit the link, select a service, choose an available time slot, and confirm their booking instantly.' },
                            { q: 'What notifications are sent?', a: 'Both you and your clients receive instant confirmations when bookings are made. Clients also get reminders before their appointments to reduce no-shows.' },
                            { q: 'Can I manage multiple specialists?', a: 'Yes! You can add multiple team members, each with their own services, schedules, and availability settings.' },
                            { q: 'Is there a free trial?', a: 'Yes, you can start using Vjen for free. Sign up today and experience the power of automated scheduling.' },
                        ].map((faq, i) => (
                            <div key={i} style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                            }}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-4) var(--space-6)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                >
                                    <span style={{ fontWeight: '600' }}>{faq.q}</span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        style={{
                                            transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s',
                                        }}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                                {openFaq === i && (
                                    <div style={{
                                        padding: '0 var(--space-6) var(--space-4)',
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.7',
                                    }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: 'var(--space-20) var(--space-8)',
                background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)',
                textAlign: 'center',
                color: 'white',
            }}>
                <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: '700', marginBottom: 'var(--space-4)', color: 'white' }}>
                        Ready to Eliminate Scheduling Chaos?
                    </h2>
                    <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)', opacity: 0.9 }}>
                        Join thousands of professionals who have transformed their business with Vjen.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/login" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary-600)', padding: 'var(--space-4) var(--space-8)' }}>
                            Start for Free
                        </Link>
                        <button onClick={() => setShowDemoModal(true)} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: 'var(--space-4) var(--space-8)' }}>
                            Book a Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: 'var(--space-8)', background: '#0f172a', color: 'white', textAlign: 'center' }}>
                <div style={{ opacity: 0.7, fontSize: 'var(--text-sm)' }}>
                    © 2026 Vjen. All rights reserved.
                </div>
            </footer>

            {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}
        </main>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            transition: 'transform 0.2s, box-shadow 0.2s',
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(20, 184, 166, 0.1)',
                color: 'var(--color-primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: 'var(--space-2)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
        </div>
    );
}
