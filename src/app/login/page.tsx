'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBusinessForUser } from '@/lib/store';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Create business for new user
                await createBusinessForUser(userCredential.user.uid, email);
            }
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ndodhi një gabim');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // We can check distinct user creation, but since createBusinessForUser is safe (manual override, wait, setDoc overwrites!)
            // We should use getBusiness to check existence first
            // Actually, safe approach: relying on dashboard to init or checking here:
            // For now, let's rely on getBusiness auto-creation logic in store.ts for social login
            // as modifying store.ts createBusinessForUser to be 'create if not exists' was not done.
            // The getBusiness() update I JUST made handles auto-creation if auth user matches.
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Google login failed');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const provider = new FacebookAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Facebook login failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            background: 'var(--bg-secondary)',
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                    <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
                        {isLogin ? 'Kyçuni në Vjen' : 'Regjistrohuni në Vjen'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? 'Mirë se erdhët përsëri!' : 'Filloni menaxhimin e termineve tuaja'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: 'var(--space-3)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--color-error-500)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-4)',
                        fontSize: 'var(--text-sm)',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="email@shembull.com"
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="password">Fjalëkalimi</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: 'var(--space-2)' }}
                    >
                        {loading ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : (isLogin ? 'Kyçu' : 'Regjistrohu')}
                    </button>
                </form>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    margin: 'var(--space-6) 0',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>OSE</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleGoogleLogin}
                        style={{ justifyContent: 'center' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 'var(--space-2)' }}>
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                        Vazhdo me Google
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleFacebookLogin}
                        style={{ justifyContent: 'center' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 'var(--space-2)' }}>
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.647 4.504-4.647 1.3 0 2.67.232 2.67.232v2.933h-1.504c-1.49 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Vazhdo me Facebook
                    </button>
                </div>

                <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {isLogin ? 'Nuk keni llogari? ' : 'Keni llogari? '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary-500)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {isLogin ? 'Regjistrohuni' : 'Kyçuni'}
                    </button>
                </p>
            </div>
        </div>
    );
}
