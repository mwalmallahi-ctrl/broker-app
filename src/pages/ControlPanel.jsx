import React, { useState } from 'react';
import { translations } from '../constants/translations';
import { 
  Users, Building, Settings, BarChart3, Plus, 
  Trash2, Edit, ShieldCheck, Mail, Shield, Languages, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ControlPanel = ({ lang = 'en', setLang }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState('users');
  
  // Dummy Admin Data
  const [users] = useState([
    { id: 1, name: 'John Broker', email: 'john@broker.com', role: t.broker || 'Broker', status: t.active },
    { id: 2, name: 'Alice Admin', email: 'alice@proker.com', role: t.mainEditor, status: t.active },
    { id: 3, name: 'Mark Junior', email: 'mark@listing.com', role: t.broker || 'Broker', status: t.pending },
  ]);

  const stats = [
    { label: t.totalBrokers, value: '24', icon: <Users size={20} />, color: '#10b981' },
    { label: t.liveProperties, value: '142', icon: <Building size={20} />, color: '#3b82f6' },
    { label: t.rentedThisMonth, value: '18', icon: <BarChart3 size={20} />, color: '#8b5cf6' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        borderRight: lang === 'en' ? '1px solid var(--border-glass)' : 'none', 
        borderLeft: lang === 'ar' ? '1px solid var(--border-glass)' : 'none',
        padding: '2rem 1.5rem',
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '8px' }}>
            <Shield size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{t.adminHub}</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--primary)',
              background: 'transparent', color: 'var(--primary)', cursor: 'pointer', textAlign: lang === 'ar' ? 'right' : 'left', fontWeight: '700', marginBottom: '1rem'
            }}
          >
            <Languages size={18} /> {lang === 'en' ? 'العربية' : 'English'}
          </button>

          {[
            { id: 'users', label: t.userManagement, icon: <Users size={18} /> },
            { id: 'properties', label: t.globalProperties, icon: <Building size={18} /> },
            { id: 'analytics', label: t.marketInsights, icon: <BarChart3 size={18} /> },
            { id: 'settings', label: t.systemSettings, icon: <Settings size={18} /> },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === item.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: lang === 'ar' ? 'right' : 'left',
                transition: 'all 0.2s',
                fontWeight: activeTab === item.id ? '700' : '500'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <Link to="/dashboard" style={{ 
          display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text-muted)', 
          textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', marginTop: 'auto' 
        }}>
          <ArrowLeft size={16} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /> {t.back}
        </Link>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{t.controlPanel}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? 'Real Estate Governance & Operations' : 'عمليات وحوكمة العقارات'}</p>
          </div>
          <button className="btn-primary">
            <Plus size={18} /> {t.newAccount}
          </button>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {stats.map((stat, i) => (
            <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                padding: '12px', 
                background: `${stat.color}15`, 
                color: stat.color, 
                borderRadius: '12px' 
              }}>
                {stat.icon}
              </div>
              <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Table Section */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: '700' }}>{t.registeredBrokers}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '4px 8px', background: 'transparent', border: '1px solid var(--border-glass)', color: 'white', borderRadius: '4px', fontSize: '0.75rem' }}>{lang === 'en' ? 'Export PDF' : 'تصدير PDF'}</button>
              <button style={{ padding: '4px 8px', background: 'transparent', border: '1px solid var(--border-glass)', color: 'white', borderRadius: '4px', fontSize: '0.75rem' }}>{lang === 'en' ? 'Bulk Actions' : 'إجراءات جماعية'}</button>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>{t.brokerName}</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>{t.contact}</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>{t.accessLevel}</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>{t.status}</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textAlign: lang === 'ar' ? 'left' : 'right' }}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderTop: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
                        {user.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: '600', color: 'white' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {user.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'white' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {user.role === t.mainEditor ? <ShieldCheck size={14} color="var(--primary)" /> : <Shield size={14} />}
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: user.status === t.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: user.status === t.active ? '#10b981' : '#f87171', fontWeight: '700' }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: lang === 'ar' ? 'left' : 'right' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit size={16} /></button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239, 68, 68, 0.7)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ControlPanel;
