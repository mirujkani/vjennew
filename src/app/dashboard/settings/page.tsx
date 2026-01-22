'use client';

import { useState, useEffect } from 'react';
import { getBusiness, updateBusiness, getSpecialists, addSpecialist, deleteSpecialist, getAvailability, updateAvailability } from '@/lib/store';
import { Business, Specialist, Service, Availability } from '@/lib/types';
import ImageUpload from '@/components/ui/ImageUpload';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsPage() {
    const { language, setLanguage, t } = useLanguage();
    const [business, setBusiness] = useState<Business | null>(null);
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [availability, setAvailabilityState] = useState<Availability | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showAddSpecialist, setShowAddSpecialist] = useState(false);
    const [newSpecialist, setNewSpecialist] = useState<{ name: string, title: string, bio: string, specialties: string, avatar?: string }>({ name: '', title: '', bio: '', specialties: '', avatar: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [showAddService, setShowAddService] = useState(false);
    const [newService, setNewService] = useState<{ name: string, price: string, description: string }>({ name: '', price: '', description: '' });

    const loadData = async () => {
        try {
            const [biz, specs, avail] = await Promise.all([
                getBusiness(),
                getSpecialists(),
                getAvailability()
            ]);
            setBusiness(biz);
            setSpecialists(specs);
            setAvailabilityState(avail);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async () => {
        if (!business) return;
        setIsSaving(true);
        try {
            const updates = { ...business };

            if (!business.urlLocked && business.uniqueLink && business.uniqueLink !== 'myclinic') {
                updates.urlLocked = true;
            }

            await updateBusiness(updates);

            if (availability) {
                await updateAvailability(availability);
            }

            setBusiness(updates);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving business:', error);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const copyLink = () => {
        if (business) {
            const fullLink = `${window.location.origin}/${business.uniqueLink}`;
            navigator.clipboard.writeText(fullLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAddSpecialist = async () => {
        if (newSpecialist.name && newSpecialist.title) {
            try {
                await addSpecialist({
                    name: newSpecialist.name,
                    title: newSpecialist.title,
                    bio: newSpecialist.bio,
                    avatar: newSpecialist.avatar,
                    specialties: newSpecialist.specialties.split(',').map(s => s.trim()).filter(s => s),
                });
                await loadData();
                setNewSpecialist({ name: '', title: '', bio: '', specialties: '' });
                setShowAddSpecialist(false);
            } catch (error) {
                console.error('Error adding specialist:', error);
                alert('Failed to add specialist');
            }
        }
    };

    const handleDeleteSpecialist = async (id: string) => {
        if (specialists.length <= 1) {
            alert('You must have at least one specialist.');
            return;
        }
        if (confirm('Are you sure you want to delete this specialist?')) {
            try {
                await deleteSpecialist(id);
                await loadData();
            } catch (error) {
                console.error('Error deleting specialist:', error);
                alert('Failed to delete specialist');
            }
        }
    };

    const handleAddService = async () => {
        if (!business || !newService.name || !newService.price) return;
        const service: Service = {
            id: Date.now().toString(),
            businessId: business.id,
            name: newService.name,
            price: parseFloat(newService.price),
            ...(newService.description ? { description: newService.description } : {}),
        };

        const updatedServices = [...(business.services || []), service];
        const updatedBusiness = { ...business, services: updatedServices };

        try {
            setBusiness(updatedBusiness); // Optimistic update
            await updateBusiness({ services: updatedServices });
            setNewService({ name: '', price: '', description: '' });
            setShowAddService(false);
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Failed to add service');
            // Revert on error would be ideal but for now we just alert
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!business) return;

        const updatedServices = (business.services || []).filter(s => s.id !== id);
        const updatedBusiness = { ...business, services: updatedServices };

        try {
            setBusiness(updatedBusiness); // Optimistic update
            await updateBusiness({ services: updatedServices });
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service');
        }
    };

    if (isLoading || !business) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                <div className="spinner" />
            </div>
        );
    }


    const toggleServices = async () => {
        if (!business) return;
        const newValue = !business.showServices;
        setBusiness({ ...business, showServices: newValue });
        try {
            await updateBusiness({ showServices: newValue });
        } catch (error) {
            console.error('Error updating showServices:', error);
            // Revert on error
            setBusiness({ ...business, showServices: !newValue });
        }
    };

    const toggleNotificationSound = async () => {
        if (!business) return;
        const newValue = !business.notificationSound;
        setBusiness({ ...business, notificationSound: newValue });
        try {
            await updateBusiness({ notificationSound: newValue });
        } catch (error) {
            console.error('Error updating notificationSound:', error);
            setBusiness({ ...business, notificationSound: !newValue });
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>{t('settings.title')}</h1>

            {/* Preferences */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{t('settings.language')}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    {t('settings.language_desc')}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`btn ${language === 'en' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('sq')}
                        className={`btn ${language === 'sq' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Shqip
                    </button>
                </div>
            </div>

            {/* Booking Link */}
            <div className="card" style={{
                marginBottom: 'var(--space-6)',
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            }}>
                <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Booking Link</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Share this link with your clients so they can book appointments.
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                    flexWrap: 'wrap',
                }}>
                    <div style={{
                        flex: 1,
                        minWidth: '250px',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)',
                    }}>
                        <span style={{ color: 'var(--text-muted)', marginRight: 'var(--space-1)' }}>
                            {typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/
                        </span>
                        <span style={{ color: 'var(--color-primary-400)', fontWeight: 'var(--font-medium)' }}>
                            {business.uniqueLink}
                        </span>
                    </div>
                    <button className="btn btn-primary" onClick={copyLink}>
                        {copied ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                                Copy Link
                            </>
                        )}
                    </button>
                </div>

                <div className="form-group" style={{ margin: 0, maxWidth: '400px' }}>
                    <label className="form-label" htmlFor="uniqueLink">
                        Customize Unique Link
                        {business.urlLocked && <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>(Locked)</span>}
                    </label>
                    <input
                        id="uniqueLink"
                        type="text"
                        className="form-input"
                        value={business.uniqueLink}
                        onChange={(e) => !business.urlLocked && setBusiness({ ...business, uniqueLink: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        placeholder="your-unique-link"
                        disabled={business.urlLocked}
                        style={business.urlLocked ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                    />
                    {!business.urlLocked && business.uniqueLink !== 'myclinic' && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning-500)', marginTop: 'var(--space-2)' }}>
                            Warning: After saving, this link will be locked and cannot be changed.
                        </p>
                    )}
                </div>
            </div>

            {/* Business Information */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-6)',
                }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Business Information</h2>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : (saved ? 'Saved!' : 'Save Changes')}
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--space-6)',
                }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <ImageUpload
                            label="Business Logo"
                            currentImage={business.logo}
                            onImageUploaded={(url) => setBusiness({ ...business, logo: url })}
                            directory="business-logos"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Business Name</label>
                        <input
                            id="name"
                            type="text"
                            className="form-input"
                            value={business.name}
                            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            className="form-input"
                            value={business.phone}
                            onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="address">Address</label>
                        <input
                            id="address"
                            type="text"
                            className="form-input"
                            value={business.address}
                            onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                    <label className="form-label" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="form-input form-textarea"
                        value={business.description}
                        onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                        rows={3}
                        placeholder="Describe your business..."
                    />
                </div>

                {availability && (
                    <div className="form-group" style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)' }}>
                        <label className="form-label" htmlFor="appointmentDuration">Appointment Duration</label>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                            Set the standard length of your appointments (in minutes).
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {[15, 30, 45, 60].map(duration => (
                                <button
                                    key={duration}
                                    onClick={() => setAvailabilityState({
                                        ...availability,
                                        defaultDuration: duration,
                                        appointmentDurations: [duration]
                                    })}
                                    className={`btn ${availability.defaultDuration === duration ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ padding: 'var(--space-2) var(--space-4)' }}
                                >
                                    {duration} min
                                </button>
                            ))}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>or custom:</span>
                                <input
                                    type="number"
                                    className="form-input"
                                    style={{ width: '80px', padding: 'var(--space-2)' }}
                                    value={availability.defaultDuration}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val > 0) {
                                            setAvailabilityState({
                                                ...availability,
                                                defaultDuration: val,
                                                appointmentDurations: [val]
                                            });
                                        }
                                    }}
                                />
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>min</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Services Toggle & Management */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-4)',
                }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Services and Pricing</h2>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 'var(--space-1) 0 0' }}>
                            Enable to display services on your booking page
                        </p>
                    </div>
                    <div
                        onClick={toggleServices}
                        style={{
                            cursor: 'pointer',
                            width: '44px',
                            height: '24px',
                            borderRadius: '999px',
                            background: business.showServices ? 'var(--color-primary-500)' : 'var(--bg-tertiary)',
                            position: 'relative',
                            transition: 'background 0.2s ease',
                            border: `1px solid ${business.showServices ? 'var(--color-primary-500)' : 'var(--border-color)'}`
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '2px',
                            left: business.showServices ? '22px' : '2px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'white',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }} />
                    </div>
                </div>

                {business.showServices && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                            {(business.services || []).length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-4)' }}>
                                    You have no services added. Add your services below.
                                </p>
                            ) : (
                                (business.services || []).map((service) => (
                                    <div key={service.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 'var(--space-3) var(--space-4)',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border-color)',
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                                                {service.name}
                                            </div>
                                            {service.description && (
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                                    {service.description}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-primary-500)', fontSize: 'var(--text-lg)' }}>
                                                €{service.price.toFixed(2)}
                                            </span>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => handleDeleteService(service.id)}
                                                style={{ color: 'var(--color-error-500)' }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3,6 5,6 21,6" />
                                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={() => setShowAddService(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Service
                        </button>
                    </>
                )}

                {/* Add Service Modal */}
                {showAddService && (
                    <div className="modal-overlay" onClick={() => setShowAddService(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 style={{ margin: 0 }}>Add Service</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowAddService(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Service Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        placeholder="e.g. Haircut"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (€) *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        placeholder="25.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description (optional)</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        placeholder="Brief description of the service..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddService(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddService}>Add</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Notification Settings */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Notifications</h2>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 'var(--space-1) 0 0' }}>
                            Enable sound for new notifications
                        </p>
                    </div>
                    <div
                        onClick={toggleNotificationSound}
                        style={{
                            cursor: 'pointer',
                            width: '44px',
                            height: '24px',
                            borderRadius: '999px',
                            background: business.notificationSound ? 'var(--color-primary-500)' : 'var(--bg-tertiary)',
                            position: 'relative',
                            transition: 'background 0.2s ease',
                            border: `1px solid ${business.notificationSound ? 'var(--color-primary-500)' : 'var(--border-color)'}`
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '2px',
                            left: business.notificationSound ? '22px' : '2px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'white',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }} />
                    </div>
                </div>
            </div>

            {/* Specialists */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-4)',
                }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Specialists</h2>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowAddSpecialist(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add New
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {specialists.map((spec) => (
                        <div key={spec.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            padding: 'var(--space-4)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-color)',
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'var(--gradient-accent)',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <span style={{ color: 'white', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
                                    {spec.name.charAt(0)}
                                </span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                                    {spec.name}
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    {spec.title}
                                </div>
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleDeleteSpecialist(spec.id)}
                                style={{ color: 'var(--color-error-500)' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6" />
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Specialist Modal */}
                {showAddSpecialist && (
                    <div className="modal-overlay" onClick={() => setShowAddSpecialist(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 style={{ margin: 0 }}>Add Specialist</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowAddSpecialist(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ImageUpload
                                    label="Profile Photo"
                                    currentImage={newSpecialist.avatar}
                                    onImageUploaded={(url) => setNewSpecialist({ ...newSpecialist, avatar: url })}
                                    directory="specialist-avatars"
                                    circular={true}
                                />
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSpecialist.name}
                                        onChange={(e) => setNewSpecialist({ ...newSpecialist, name: e.target.value })}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSpecialist.title}
                                        onChange={(e) => setNewSpecialist({ ...newSpecialist, title: e.target.value })}
                                        placeholder="Cosmetologist, Hairdresser, etc."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        value={newSpecialist.bio}
                                        onChange={(e) => setNewSpecialist({ ...newSpecialist, bio: e.target.value })}
                                        placeholder="Brief description..."
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Services (comma separated)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newSpecialist.specialties}
                                        onChange={(e) => setNewSpecialist({ ...newSpecialist, specialties: e.target.value })}
                                        placeholder="Makeup, Haircut, etc."
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddSpecialist(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddSpecialist}>Add</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
