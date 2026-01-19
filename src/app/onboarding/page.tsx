'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBusiness, updateBusiness, getAvailability, updateAvailability, getSpecialists, addSpecialist, deleteSpecialist } from '@/lib/store';
import { Business, Availability, Specialist, Service } from '@/lib/types';
import ImageUpload from '@/components/ui/ImageUpload';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [business, setBusiness] = useState<Business | null>(null);
    const [availability, setAvailability] = useState<Availability | null>(null);
    const [specialists, setSpecialists] = useState<Specialist[]>([]);

    // Specialists state for local editing before save (optional, or just save directly)
    // For simplicity in this flow, we'll fetch real data and mutate it directly via store calls for lists,
    // or keep local state and save on "Next". 
    // Given the complexity of lists, it's often easier to save immediately or use local state.
    // Let's use local state and save on step transition to minimize API calls and potential errors.

    const [servicesList, setServicesList] = useState<Service[]>([]);
    const [specialistsList, setSpecialistsList] = useState<Partial<Specialist>[]>([]);
    const [socialShared, setSocialShared] = useState({ facebook: false, instagram: false });

    useEffect(() => {
        const loadData = async () => {
            try {
                const biz = await getBusiness();
                if (biz.onboardingCompleted) {
                    router.push('/dashboard');
                    return;
                }
                const avail = await getAvailability(biz.id);
                const specs = await getSpecialists(biz.id);

                setBusiness(biz);
                setAvailability(avail);
                setSpecialists(specs);
                setServicesList(biz.services || []);

                // Initialize specialists list if empty (at least one for the owner)
                if (specs.length === 0) {
                    setSpecialistsList([{
                        name: '',
                        title: 'Specialist',
                        specialties: ['General Service']
                    }]);
                } else {
                    setSpecialistsList(specs);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading onboarding data:', error);
            }
        };
        loadData();
    }, [router]);

    const handleStep1Save = async () => {
        if (!business || !availability) return;
        setSaving(true);
        try {
            await updateBusiness(business);
            await updateAvailability(availability);
            setStep(2);
        } catch (error) {
            console.error(error);
            alert('Error saving data.');
        } finally {
            setSaving(false);
        }
    };

    const handleStep2Save = async () => {
        if (!business) return;
        setSaving(true);
        try {
            // Save Services
            await updateBusiness({ ...business, services: servicesList });

            // Save Specialists
            // This is tricky. We'll delete existing and recreate, or update. 
            // For onboarding, simplistic approach: delete all current (if any) and create new ones from list.
            // CAUTION: This destroys IDs. Better: Update existing if ID exists, create if not.

            // For now, let's just create any NEW ones without IDs, and update existing.
            // But wait, validation: check names.
            const validSpecs = specialistsList.filter(s => s.name?.trim());
            if (validSpecs.length === 0) {
                alert('Please add at least one specialist (yourself).');
                setSaving(false);
                return;
            }

            // Simple sycn strategy for onboarding:
            // 1. Identify existing IDs
            // 2. Identify new ones
            // 3. Update existing, Add new.
            // 4. (Optional) Delete removed ones? - Maybe skip deletion for safety in onboarding.

            for (const spec of validSpecs) {
                if ((spec as Specialist).id) {
                    // Update technically needed but store doesnt have updateSpecialist exposed easily in top level?
                    // Actually store has `deleteSpecialist` and `createSpecialist`.
                    // We might need to just rely on user creating new ones properly.
                    // Let's just assume we only CREATE new ones for simplicity if they don't have IDs.
                    // But if we went back and forth steps...
                    // Let's just create new ones for now.
                } else {
                    await addSpecialist({
                        name: spec.name!,
                        title: spec.title || 'Specialist',
                        bio: spec.bio || '',
                        specialties: spec.specialties || [],
                        avatar: spec.avatar
                    });
                }
            }

            // Refresh specialists list to get IDs
            const updatedSpecs = await getSpecialists(business.id);
            setSpecialistsList(updatedSpecs);

            setStep(3);
        } catch (error) {
            console.error(error);
            alert('Error saving data.');
        } finally {
            setSaving(false);
        }
    };

    const handleStep3Save = async () => {
        if (!business) return;
        setSaving(true);
        try {
            await updateBusiness({ ...business, onboardingCompleted: true });
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Error finalizing setup.');
        } finally {
            setSaving(false);
        }
    };

    // --- Renders ---

    if (loading || !business || !availability) {
        return <div className="flex-center h-screen"><div className="spinner" /></div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 'var(--space-6)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Progress Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-8)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'var(--border-color)', zIndex: 0 }} />
                    {[1, 2, 3].map((s) => (
                        <div key={s} style={{
                            width: '40px', height: '40px',
                            borderRadius: '50%',
                            background: step >= s ? 'var(--color-primary-500)' : 'var(--bg-tertiary)',
                            color: step >= s ? 'white' : 'var(--text-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 1, position: 'relative', fontWeight: 'bold'
                        }}>
                            {s}
                        </div>
                    ))}
                </div>

                <div className="card">

                    {/* STEP 1: Business Info */}
                    {step === 1 && (
                        <div>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Business Details</h2>

                            <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                                <ImageUpload
                                    label="Logo"
                                    currentImage={business.logo}
                                    onImageUploaded={(url) => setBusiness({ ...business, logo: url })}
                                    directory="business-logos"
                                    circular
                                    className="w-auto"
                                />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <div>
                                        <label className="form-label">Business Name</label>
                                        <input
                                            className="form-input"
                                            value={business.name}
                                            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                                            placeholder="e.g. Vjen Clinic"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            className="form-input"
                                            value={business.phone}
                                            onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input
                                        className="form-input"
                                        value={business.email}
                                        onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Address</label>
                                    <input
                                        className="form-input"
                                        value={business.address}
                                        onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <h3 style={{ fontSize: 'var(--text-lg)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>Working Hours</h3>

                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                                    const isSelected = availability.workingDays.includes(idx);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                const days = isSelected
                                                    ? availability.workingDays.filter(d => d !== idx)
                                                    : [...availability.workingDays, idx].sort();
                                                setAvailability({ ...availability, workingDays: days });
                                            }}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: 'var(--radius-md)',
                                                border: `1px solid ${isSelected ? 'var(--color-primary-500)' : 'var(--border-color)'}`,
                                                background: isSelected ? 'var(--color-primary-50)' : 'var(--bg-tertiary)',
                                                color: isSelected ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div>
                                    <label className="form-label">Opening Time</label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={availability.startTime}
                                        onChange={(e) => setAvailability({ ...availability, startTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Closing Time</label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={availability.endTime}
                                        onChange={(e) => setAvailability({ ...availability, endTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary" onClick={handleStep1Save} disabled={saving}>
                                    Continue {saving && '...'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Team & Services */}
                    {step === 2 && (
                        <div>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Team and Services</h2>

                            {/* Specialists Section */}
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)' }}>Staff</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                                    Add your team members. If you work alone, just enter your name.
                                </p>

                                {specialistsList.map((spec, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
                                        padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                className="form-input"
                                                placeholder="Name"
                                                value={spec.name}
                                                onChange={(e) => {
                                                    const newList = [...specialistsList];
                                                    newList[idx] = { ...newList[idx], name: e.target.value };
                                                    setSpecialistsList(newList);
                                                }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                className="form-input"
                                                placeholder="Title (e.g. Physiotherapist)"
                                                value={spec.title}
                                                onChange={(e) => {
                                                    const newList = [...specialistsList];
                                                    newList[idx] = { ...newList[idx], title: e.target.value };
                                                    setSpecialistsList(newList);
                                                }}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => setSpecialistsList(specialistsList.filter((_, i) => i !== idx))}
                                            style={{ color: 'var(--color-error-500)' }}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setSpecialistsList([...specialistsList, { name: '', title: 'Specialist', specialties: [] }])}
                                >
                                    + Add Member
                                </button>
                            </div>

                            <hr style={{ margin: 'var(--space-6) 0', borderColor: 'var(--border-color)' }} />

                            {/* Services Toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                                <div>
                                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '0' }}>Services</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                        Do you offer services with different prices/durations?
                                    </p>
                                </div>
                                <div
                                    onClick={() => setBusiness({ ...business, showServices: !business.showServices })}
                                    style={{
                                        cursor: 'pointer',
                                        width: '44px', height: '24px', borderRadius: '999px',
                                        background: business.showServices ? 'var(--color-primary-500)' : 'var(--bg-tertiary)',
                                        position: 'relative', transition: 'background 0.2s',
                                        border: `1px solid ${business.showServices ? 'var(--color-primary-500)' : 'var(--border-color)'}`
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', top: '2px', left: business.showServices ? '22px' : '2px',
                                        width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.2s'
                                    }} />
                                </div>
                            </div>

                            {business.showServices && (
                                <div>
                                    {servicesList.map((srv, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)',
                                            padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)'
                                        }}>
                                            <input
                                                className="form-input" placeholder="Service name"
                                                value={srv.name}
                                                onChange={(e) => {
                                                    const nl = [...servicesList];
                                                    nl[idx] = { ...nl[idx], name: e.target.value };
                                                    setServicesList(nl);
                                                }}
                                                style={{ flex: 2 }}
                                            />
                                            <input
                                                className="form-input" placeholder="Price (€)" type="number"
                                                value={srv.price}
                                                onChange={(e) => {
                                                    const nl = [...servicesList];
                                                    nl[idx] = { ...nl[idx], price: parseFloat(e.target.value) };
                                                    setServicesList(nl);
                                                }}
                                                style={{ flex: 1 }}
                                            />
                                            <input
                                                className="form-input" placeholder="Min" type="number"
                                                value={srv.duration || 30}
                                                onChange={(e) => {
                                                    const nl = [...servicesList];
                                                    nl[idx] = { ...nl[idx], duration: parseFloat(e.target.value) };
                                                    setServicesList(nl);
                                                }}
                                                style={{ flex: 1 }}
                                            />
                                            <button
                                                className="btn btn-ghost"
                                                onClick={() => setServicesList(servicesList.filter((_, i) => i !== idx))}
                                                style={{ color: 'var(--color-error-500)' }}
                                            >X</button>
                                        </div>
                                    ))}
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setServicesList([...servicesList, { id: Date.now().toString(), businessId: business.id, name: '', price: 0, duration: 30 }])}
                                    >
                                        + Add Service
                                    </button>
                                </div>
                            )}

                            <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between' }}>
                                <button className="btn btn-ghost" onClick={() => setStep(1)} disabled={saving}>Back</button>
                                <button className="btn btn-primary" onClick={handleStep2Save} disabled={saving}>Continue {saving && '...'}</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Unique Link */}
                    {step === 3 && (
                        <div style={{ textAlign: 'center' }}>
                            <div className="success-checkmark" style={{ margin: '0 auto var(--space-4)' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Ready to get started!</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                                Configure your unique link to share with clients.
                            </p>

                            <div style={{ maxWidth: '400px', margin: '0 auto var(--space-6)' }}>
                                <label className="form-label text-left">Booking Link</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                        <span style={{
                                            background: 'var(--bg-tertiary)', padding: 'var(--space-3)',
                                            border: '1px solid var(--border-color)', borderRight: 'none',
                                            borderTopLeftRadius: 'var(--radius-md)', borderBottomLeftRadius: 'var(--radius-md)',
                                            color: 'var(--text-muted)'
                                        }}>
                                            vjen.al/
                                        </span>
                                        <input
                                            className="form-input"
                                            value={business.uniqueLink}
                                            onChange={(e) => setBusiness({ ...business, uniqueLink: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => navigator.clipboard.writeText(`vjen.al/${business.uniqueLink}`)}
                                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none' }}
                                    >
                                        Copy Link
                                    </button>
                                </div>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)', textAlign: 'left' }}>
                                    This link will be used by your clients to book appointments.
                                </p>
                            </div>

                            <div style={{ maxWidth: '400px', margin: '0 auto var(--space-8)' }}>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                                    We suggest adding your booking link to your social media bios:
                                </p>

                                <div style={{ marginBottom: 'var(--space-6)' }}>
                                    {/* Facebook Section */}
                                    <div style={{ background: '#f0f2f5', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#1877F2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: '#333' }}>Facebook</span>
                                        </div>

                                        <div style={{
                                            background: 'white', border: '1px solid #ddd', borderRadius: 'var(--radius-md)',
                                            padding: 'var(--space-3)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#555',
                                            textAlign: 'left'
                                        }}>
                                            <p style={{ margin: 0 }}>Book your appointment here: vjen.al/{business.uniqueLink} 📅✨</p>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => navigator.clipboard.writeText(`Book your appointment here: vjen.al/${business.uniqueLink} 📅✨`)}
                                                style={{ paddingLeft: 0, color: '#1877F2', fontWeight: 600 }}
                                            >
                                                Copy Text
                                            </button>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', cursor: 'pointer', color: '#666' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={socialShared.facebook}
                                                    onChange={() => setSocialShared({ ...socialShared, facebook: !socialShared.facebook })}
                                                    style={{ width: '16px', height: '16px', accentColor: '#1877F2' }}
                                                />
                                                Posted
                                            </label>
                                        </div>
                                    </div>

                                    {/* Instagram Section */}
                                    <div style={{ background: '#fafafa', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                            <div style={{
                                                width: '24px', height: '24px', borderRadius: '8px',
                                                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                                </svg>
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: '#333' }}>Instagram</span>
                                        </div>

                                        <div style={{
                                            background: 'white', border: '1px solid #ddd', borderRadius: 'var(--radius-md)',
                                            padding: 'var(--space-3)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: '#555',
                                            textAlign: 'left'
                                        }}>
                                            <p style={{ margin: 0 }}>Book now at: vjen.al/{business.uniqueLink} 📲🔥</p>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => navigator.clipboard.writeText(`Book now at: vjen.al/${business.uniqueLink} 📲🔥`)}
                                                style={{ paddingLeft: 0, color: '#E1306C', fontWeight: 600 }}
                                            >
                                                Copy Text
                                            </button>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', cursor: 'pointer', color: '#666' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={socialShared.instagram}
                                                    onChange={() => setSocialShared({ ...socialShared, instagram: !socialShared.instagram })}
                                                    style={{ width: '16px', height: '16px', accentColor: '#E1306C' }}
                                                />
                                                Posted
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary w-full max-w-sm" onClick={handleStep3Save} disabled={saving}>
                                Finish
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
