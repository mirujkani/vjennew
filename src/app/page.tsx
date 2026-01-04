import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-6)',
                background: 'var(--gradient-hero)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    marginBottom: 'var(--space-12)',
                }} className="animate-fade-in">
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-glow)',
                    }}>
                        <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'white' }}>V</span>
                    </div>
                    <span style={{
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--color-primary-400) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Vjen
                    </span>
                </div>

                {/* Hero Content */}
                <div style={{ textAlign: 'center', maxWidth: '800px' }} className="animate-fade-in-up">
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                        fontWeight: 'bold',
                        lineHeight: '1.1',
                        marginBottom: 'var(--space-6)',
                        color: 'var(--text-primary)',
                    }}>
                        Simplify Your<br />
                        <span style={{
                            background: 'linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-accent-500) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Physiotherapy Practice
                        </span>
                    </h1>

                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-10)',
                        lineHeight: '1.7',
                    }}>
                        Modern appointment scheduling with WhatsApp integration.<br />
                        Give your clients a seamless booking experience.
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/dashboard" className="btn btn-primary btn-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                <polyline points="9,22 9,12 15,12 15,22" />
                            </svg>
                            Go to Dashboard
                        </Link>
                        <Link href="/physio123" className="btn btn-secondary btn-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Try Booking Demo
                        </Link>
                    </div>
                </div>

                {/* Feature Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-6)',
                    marginTop: 'var(--space-16)',
                    maxWidth: '1000px',
                    width: '100%',
                }}>
                    <FeatureCard
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        }
                        title="Instant Booking"
                        description="Clients book directly from your unique link. No back-and-forth needed."
                        delay={0}
                    />
                    <FeatureCard
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                            </svg>
                        }
                        title="WhatsApp Automation"
                        description="Automatic confirmations and reminders via WhatsApp messages or calls."
                        delay={1}
                    />
                    <FeatureCard
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        }
                        title="Smart Scheduling"
                        description="Set your working hours, breaks, and appointment durations with ease."
                        delay={2}
                    />
                </div>
            </div>
        </main>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    delay,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}) {
    return (
        <div
            className="card animate-fade-in-up"
            style={{
                animationDelay: `${delay * 100 + 200}ms`,
                animationFillMode: 'both',
            }}
        >
            <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(20, 184, 166, 0.1)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary-400)',
                marginBottom: 'var(--space-4)',
            }}>
                {icon}
            </div>
            <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
            }}>
                {title}
            </h3>
            <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                margin: 0,
            }}>
                {description}
            </p>
        </div>
    );
}
