import { translations } from '../constants/translations';
import { MapPin, Phone, Square, Calendar, Share2, ExternalLink, UserPlus, Coins, Globe, Lock, Eye, EyeOff, UserCheck, Home, Store, FileText, Trash2, Send } from 'lucide-react';

const PropertyCard = ({ property, onShare, onToggle, onDelete, onView, userRole, lang = 'en' }) => {
  const t = translations[lang];
  const {
    name, type, area, location, unitType, 
    availability, lastUpdated, sourcePhone, 
    photoUrl, mapLink, use, purpose, price, isShareable, ownerName
  } = property;

  return (
    <div className="glass-card property-card">
      <div className="card-image-container" style={{
        position: 'relative',
        height: '200px',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <img 
          src={photoUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80'} 
          alt={name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span className={`badge ${availability === 'Available' ? 'badge-available' : 'badge-rented'}`}>
            {availability}
          </span>
          <span style={{ 
            fontSize: '0.65rem', 
            fontWeight: '800', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            background: purpose === 'Rent' ? '#3b82f6' : '#f59e0b', 
            color: 'white',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            For {purpose}
          </span>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isShareable ? <Globe size={12} color="#10b981" /> : <Lock size={12} color="#f43f5e" />}
          <span>{use}</span> | <span>{type}</span>
        </div>
      </div>

      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{name}</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              {use === 'Residential' ? t.residential : t.commercial} • {purpose === 'Rent' ? t.forRent : t.forSale}
            </span>
          </div>
          <div style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '4px 10px', 
            borderRadius: '6px', 
            fontSize: '0.9rem', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
            textAlign: lang === 'ar' ? 'left' : 'right'
          }}>
            <Coins size={14} /> 
            {price || 'N/A'} 
            <span style={{ fontSize: '0.65rem', opacity: 0.8, fontWeight: '500' }}>
              {purpose === 'Rent' ? (lang === 'en' ? 'AED/Yr' : 'درهم/سنوي') : (lang === 'en' ? 'AED' : 'درهم')}
            </span>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} /> {location}
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px', 
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Square size={16} color="var(--primary)" />
            <span>{area} {t.sqft}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={16} color="var(--primary)" />
            <span>{unitType}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--primary)" />
            <span>{t.lastUpdated}: {lastUpdated}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={16} color="var(--primary)" />
            <a href={`tel:${sourcePhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{sourcePhone}</a>
          </div>
          {ownerName && (
            <div style={{ 
              gridColumn: 'span 2', 
              marginTop: '8px', 
              padding: '6px 10px', 
              background: 'rgba(16, 185, 129, 0.05)', 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              <UserCheck size={14} />
              {t.ownerName}: {ownerName}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button 
            onClick={onView}
            className="btn-primary" 
            style={{ flex: 1, justifyContent: 'center', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
          >
            <FileText size={16} /> {lang === 'en' ? 'View Details' : 'عرض التفاصيل'}
          </button>
          
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`Check out this property:\n\n*Name:* ${name}\n*Type:* ${type} - ${use}\n*Price:* ${price} AED\n*Location:* ${location}\n*Area:* ${area} SQFT\n*Map Link:* ${mapLink}`)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-glass" 
            style={{ 
              padding: '0.75rem', background: '#25D366', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' 
            }}
            title="WhatsApp"
          >
            <Send size={16} />
          </a>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <a 
            href={mapLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary" 
            style={{ flex: 1, justifyContent: 'center', padding: '0.75rem 1rem', textDecoration: 'none' }}
          >
            <MapPin size={16} /> {t.viewMap}
          </a>
          
          <button 
            className="btn-glass" 
            onClick={onToggle}
            title={lang === 'en' ? (isShareable ? "Hide Property" : "Make Shareable") : (isShareable ? "إخفاء العقار" : "جاهز للمشاركة")}
            style={{ 
              padding: '0.75rem', 
              background: 'rgba(255,255,255,0.05)', 
              border: `1px solid ${isShareable ? 'var(--primary)' : '#f43f5e'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: '0.2s',
              opacity: 0.9
            }}
          >
            {isShareable ? <Eye size={16} color="var(--primary)" /> : <EyeOff size={16} color="#f43f5e" />}
          </button>

          {isShareable && (
            <button 
              className="btn-glass" 
              onClick={() => onShare(property)}
              title={lang === 'en' ? "Share with Broker" : "مشاركة مع وسيط"}
              style={{ 
                padding: '0.75rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: '0.2s'
              }}
            >
              <UserPlus size={16} color="var(--primary)" />
            </button>
          )}
          
          <button 
            className="btn-glass" 
            onClick={onDelete}
            title={lang === 'en' ? "Delete Property" : "حذف العقار"}
            style={{ 
              padding: '0.75rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: '0.2s'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
