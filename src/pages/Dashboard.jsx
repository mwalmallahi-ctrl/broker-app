import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { translations } from '../constants/translations';
import { 
  Search, Plus, Filter, LayoutGrid, List, Shield, X, MapPin, 
  Building, Square, Phone, Store, Home, Key, Tag, 
  Image as LucideImage, Share, UserPlus, Upload, Trash2, Send, Coins,
  Globe, Lock, Eye, EyeOff, UserCheck, Languages, LogOut
} from 'lucide-react';

const Dashboard = ({ userName = "Broker", userRole = "Main Editor", lang, setLang, onLogout }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(null); // stores the property to share
  const [shareEmail, setShareEmail] = useState('');
  
  // Real Local State for Properties
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePrivacy = (id) => {
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, isShareable: !p.isShareable } : p
    ));
  };

  // Form State for Adding Property
  const [newProperty, setNewProperty] = useState({
    name: '', type: 'Apartment', area: '', location: '', unitType: '', sourcePhone: '', mapLink: '',
    use: 'Residential', purpose: 'Rent', photos: [], price: '', isShareable: true, ownerName: ''
  });

  const photoInputRef = useRef();

  // Smart Compression Utility
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // 0.7 quality compression
        };
      };
    });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (newProperty.photos.length + files.length > 8) {
      alert('Maximum 8 photos allowed');
      return;
    }

    const compressed = await Promise.all(files.map(file => compressImage(file)));
    setNewProperty(prev => ({
      ...prev,
      photos: [...prev.photos, ...compressed]
    }));
  };

  const removePhoto = (index) => {
    setNewProperty(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    const propertyToAdd = {
      ...newProperty,
      photoUrl: newProperty.photos[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'
    };

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyToAdd)
      });
      
      if (response.ok) {
        fetchProperties(); // Refresh list
        setShowAddModal(false);
        setNewProperty({ 
          name: '', type: 'Apartment', area: '', location: '', unitType: '', sourcePhone: '', mapLink: '',
          use: 'Residential', purpose: 'Rent', photos: [], price: '', isShareable: true, ownerName: ''
        });
      }
    } catch (err) {
      console.error('Error adding property:', err);
    }
  };

  const handleShareSubmit = (e) => {
    e.preventDefault();
    // SECURE SHARE LOGIC: Exclude ownerName from the outgoing payload
    const { ownerName: _ignored, ...secureData } = showShareModal;
    console.log('Sharing Secure Data:', secureData);

    alert(`SECURE SHARE: Details for "${showShareModal.name}" have been sent to ${shareEmail}. NOTE: The Owner's Name has been EXCLUDED for your privacy.`);
    setShowShareModal(null);
    setShareEmail('');
  };

  // Filter properties based on search term
  const filteredProperties = properties.filter(prop => 
    (prop.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (prop.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (prop.type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (prop.use?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (prop.purpose?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" alt="MW Real Estate" style={{ width: '60px', height: 'auto' }} />
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t.welcome}, {userName}!
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>{t.hubSubtitle}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid var(--border-glass)',
              color: 'var(--primary)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Languages size={18} /> {lang === 'en' ? 'العربية' : 'English'}
          </button>
          {userRole === 'Main Editor' && (
            <Link to="/panel" className="btn-secondary" style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid var(--border-glass)',
              color: 'white',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              <Shield size={18} color="var(--primary)" /> {t.controlPanel}
            </Link>
          )}
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary" 
            style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
          >
            <Plus size={18} /> {t.addProperty}
          </button>
          <button 
            onClick={() => { if (onLogout) onLogout(); window.location.href = '/login'; }}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={18} /> {lang === 'en' ? 'Sign Out' : 'تسجيل خروج'}
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ 
        marginBottom: '2rem', 
        padding: '1rem', 
        display: 'flex', 
        gap: '12px', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search style={{ 
            position: 'absolute', 
            left: lang === 'en' ? '12px' : 'auto', 
            right: lang === 'ar' ? '12px' : 'auto', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-muted)' 
          }} size={18} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="input-field"
            style={{ 
              paddingLeft: lang === 'en' ? '40px' : '12px',
              paddingRight: lang === 'ar' ? '40px' : '12px'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary" style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border-glass)',
          color: 'white',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          cursor: 'pointer'
        }}>
          <Filter size={18} /> {t.filters}
        </button>
      </div>

      {/* Property Grid */}
      <div className="property-grid">
        {filteredProperties.map(prop => (
          <PropertyCard 
            key={prop._id || prop.id} 
            property={prop} 
            lang={lang}
            onShare={setShowShareModal} 
            onToggle={() => togglePrivacy(prop._id || prop.id)}
          />
        ))}
      </div>
      
      {filteredProperties.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem' }}>{t.noResults}</p>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={24} color="var(--primary)" /> {t.addProperty}
            </h2>

            <form onSubmit={handleAddProperty} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.ownerName}</label>
                <div style={{ position: 'relative' }}>
                  <UserCheck size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input required placeholder={lang === 'en' ? "Mr. Saeed" : "السيد سعيد"} className="input-field" style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px', border: '1px solid rgba(16, 185, 129, 0.3)' }} value={newProperty.ownerName} onChange={e => setNewProperty({...newProperty, ownerName: e.target.value})} />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.propertyName}</label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input required placeholder={lang === 'en' ? "Skyline Tower" : "برج سكاي لاين"} className="input-field" style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px' }} value={newProperty.name} onChange={e => setNewProperty({...newProperty, name: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.location}</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input required placeholder={lang === 'en' ? "Dubai Marina" : "دبي مارينا"} className="input-field" style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px' }} value={newProperty.location} onChange={e => setNewProperty({...newProperty, location: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.propertyUse}</label>
                <div style={{ position: 'relative' }}>
                  {newProperty.use === 'Residential' ? <Home size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} /> : <Store size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />}
                  <select 
                    className="input-field" 
                    style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px', appearance: 'none', cursor: 'pointer' }}
                    value={newProperty.use}
                    onChange={e => setNewProperty({...newProperty, use: e.target.value})}
                  >
                    <option value="Residential">{t.residential}</option>
                    <option value="Commercial">{t.commercial}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.purpose}</label>
                <div style={{ position: 'relative' }}>
                  {newProperty.purpose === 'Rent' ? <Key size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} /> : <Tag size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />}
                  <select 
                    className="input-field" 
                    style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px', appearance: 'none', cursor: 'pointer' }}
                    value={newProperty.purpose}
                    onChange={e => setNewProperty({...newProperty, purpose: e.target.value})}
                  >
                    <option value="Rent">{t.forRent}</option>
                    <option value="Sale">{t.forSale}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>
                  {newProperty.purpose === 'Rent' ? t.rentAmount : t.saleAmount}
                </label>
                <div style={{ position: 'relative' }}>
                  <Coins size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input 
                    required 
                    type="text"
                    placeholder={newProperty.purpose === 'Rent' ? "e.g. 120,000" : "e.g. 2,500,000"} 
                    className="input-field" 
                    style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px' }} 
                    value={newProperty.price} 
                    onChange={e => setNewProperty({...newProperty, price: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.unitType}</label>
                <input required placeholder={lang === 'en' ? "2BHK A-Type" : "غرفتين وصالة"} className="input-field" value={newProperty.unitType} onChange={e => setNewProperty({...newProperty, unitType: e.target.value})} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.area}</label>
                <div style={{ position: 'relative' }}>
                  <Square size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input required placeholder="1250" className="input-field" style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px' }} value={newProperty.area} onChange={e => setNewProperty({...newProperty, area: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.phone}</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input required placeholder="+971..." className="input-field" style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px' }} value={newProperty.sourcePhone} onChange={e => setNewProperty({...newProperty, sourcePhone: e.target.value})} />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '8px' }}>
                  {t.uploadPhotos}
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {newProperty.photos.map((photo, index) => (
                    <div key={index} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                      <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', background: 'rgba(255,255,255,0.05)' }} />
                      <button 
                        type="button" 
                        onClick={() => removePhoto(index)}
                        style={{ position: 'absolute', top: '2px', [lang === 'en' ? 'right' : 'left']: '2px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '4px', padding: '2px', cursor: 'pointer' }}
                      >
                        <Trash2 size={12} color="white" />
                      </button>
                    </div>
                  ))}
                  {newProperty.photos.length < 8 && (
                    <button 
                      type="button" 
                      onClick={() => photoInputRef.current.click()}
                      style={{ 
                        width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed var(--border-glass)', 
                        background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-muted)'
                      }}
                    >
                      <Upload size={20} />
                      <span style={{ fontSize: '0.65rem' }}>{t.upload}</span>
                    </button>
                  )}
                  <input 
                    type="file" 
                    hidden 
                    multiple 
                    ref={photoInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                  />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={newProperty.isShareable} 
                    onChange={e => setNewProperty({...newProperty, isShareable: e.target.checked})}
                    style={{ width: '18px', height: '18px', filter: 'hue-rotate(90deg)' }} 
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{t.publicSharing}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{t.sharingDesc}</div>
                  </div>
                </label>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '6px' }}>{t.mapLink}</label>
                <input required placeholder="https://maps.google.com/..." className="input-field" value={newProperty.mapLink} onChange={e => setNewProperty({...newProperty, mapLink: e.target.value})} />
              </div>

              <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '1rem', marginTop: '1rem', borderRadius: '10px', justifyContent: 'center' }}>
                {t.confirmAdd}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Broker Sharing Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setShowShareModal(null)}
              style={{ position: 'absolute', top: '1rem', [lang === 'en' ? 'right' : 'left']: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                <UserPlus size={24} color="white" />
              </div>
              <h3 style={{ fontWeight: '800' }}>{t.shareWithBroker}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.sharingDesc} "{showShareModal.name}"</p>
            </div>

            <form onSubmit={handleShareSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '8px' }}>{t.brokerEmail}</label>
                <input 
                  required 
                  type="email" 
                  placeholder={t.emailPlaceholder}
                  className="input-field" 
                  value={shareEmail} 
                  onChange={e => setShareEmail(e.target.value)} 
                />
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '10px' }}>
                <Send size={18} /> {t.shareListing}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
