import React, { useState, useEffect } from 'react';
import { translations } from '../constants/translations';
import { 
  Users, Building, Settings, BarChart3, Plus, 
  Trash2, Edit, ShieldCheck, Mail, Shield, Languages, ArrowLeft, X, Key, Eye, EyeOff, Save, LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ControlPanel = ({ lang = 'en', setLang, onLogout }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const stats = [
    { label: t.totalBrokers || 'Total Brokers', value: users.length.toString(), icon: <Users size={20} />, color: '#10b981' },
    { label: lang === 'en' ? 'Total Properties' : 'إجمالي العقارات', value: allProperties.length.toString(), icon: <Building size={20} />, color: '#3b82f6' },
    { label: lang === 'en' ? 'Shared Properties' : 'العقارات المشتركة', value: allProperties.filter(p => p.isShareable).length.toString(), icon: <Globe size={20} />, color: '#8b5cf6' },
  ];

  useEffect(() => {
    fetchUsers();
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        setAllProperties(data);
      }
    } catch {
      console.error("Failed to fetch properties for stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('brokerToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        // Fallback demo users if API not available
        setUsers([
          { _id: '1', username: 'Administrator', email: 'mwalmallahi@gmail.com', role: 'Main Editor' },
        ]);
      }
    } catch {
      setUsers([
        { _id: '1', username: 'Administrator', email: 'mwalmallahi@gmail.com', role: 'Main Editor' },
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert(lang === 'en' ? 'Password must be at least 6 characters' : 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${editingUser._id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('brokerToken')}`
        },
        body: JSON.stringify({ password: newPassword })
      });
      if (res.ok) {
        setSuccessMsg(lang === 'en' ? `Password updated for ${editingUser.username}!` : `تم تحديث كلمة المرور لـ ${editingUser.username}!`);
        setEditingUser(null);
        setNewPassword('');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(lang === 'en' ? 'Failed to update password' : 'فشل تحديث كلمة المرور');
      }
    } catch {
      alert(lang === 'en' ? 'Could not connect to server' : 'تعذر الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

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
          <img src="/logo.png" alt="MW Real Estate" style={{ width: '40px', height: 'auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{t.adminHub || 'Admin Hub'}</h2>
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
            { id: 'users', label: t.userManagement || 'User Management', icon: <Users size={18} /> },
            { id: 'properties', label: t.globalProperties || 'Properties', icon: <Building size={18} /> },
            { id: 'analytics', label: t.marketInsights || 'Analytics', icon: <BarChart3 size={18} /> },
            { id: 'settings', label: t.systemSettings || 'Settings', icon: <Settings size={18} /> },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none',
                background: activeTab === item.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer', textAlign: lang === 'ar' ? 'right' : 'left', transition: 'all 0.2s',
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
          <ArrowLeft size={16} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /> {t.back || 'Back'}
        </Link>
        <button 
          onClick={() => { if (onLogout) onLogout(); window.location.href = '/login'; }}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', 
            color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', marginTop: '8px', width: '100%'
          }}
        >
          <LogOut size={16} /> {lang === 'en' ? 'Sign Out' : 'تسجيل خروج'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{t.controlPanel || 'Control Panel'}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? 'Real Estate Governance & Operations' : 'عمليات وحوكمة العقارات'}</p>
          </div>
        </header>

        {/* Success Message */}
        {successMsg && (
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '10px', color: '#10b981', marginBottom: '1.5rem', fontWeight: '600' }}>
            ✅ {successMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {stats.map((stat, i) => (
            <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '12px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: '700' }}>{lang === 'en' ? 'Registered Users' : 'المستخدمون المسجلون'}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'Click ✏️ to reset a user\'s password' : 'اضغط ✏️ لإعادة تعيين كلمة مرور المستخدم'}
              </span>
            </div>

            {loadingUsers ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'Loading users...' : 'جاري التحميل...'}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>{lang === 'en' ? 'Name' : 'الاسم'}</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>{lang === 'en' ? 'Email' : 'البريد'}</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>{lang === 'en' ? 'Role' : 'الدور'}</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textAlign: lang === 'ar' ? 'left' : 'right' }}>{lang === 'en' ? 'Actions' : 'الإجراءات'}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ borderTop: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
                            {(user.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '600', color: 'white' }}>{user.username}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {user.email}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'white' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {user.role === 'Main Editor' ? <ShieldCheck size={14} color="var(--primary)" /> : <Shield size={14} />}
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: lang === 'ar' ? 'left' : 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}>
                          <button
                            onClick={() => { setEditingUser(user); setNewPassword(''); setShowPassword(false); }}
                            title={lang === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور'}
                            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--primary)', cursor: 'pointer', color: 'var(--primary)', padding: '6px 12px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.8rem' }}
                          >
                            <Key size={14} /> {lang === 'en' ? 'Reset PW' : 'إعادة تعيين'}
                          </button>
                          {user.email !== 'mwalmallahi@gmail.com' && (
                            <button
                              onClick={async () => {
                                if (!confirm(lang === 'en' ? `Delete user "${user.username}"? This cannot be undone.` : `حذف المستخدم "${user.username}"؟ لا يمكن التراجع.`)) return;
                                try {
                                  const res = await fetch(`/api/users/${user._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('brokerToken')}` } });
                                  if (res.ok) { fetchUsers(); setSuccessMsg(lang === 'en' ? `User "${user.username}" deleted` : `تم حذف المستخدم "${user.username}"`); setTimeout(() => setSuccessMsg(''), 3000); }
                                  else { const d = await res.json(); alert(d.error || 'Failed'); }
                                } catch { alert(lang === 'en' ? 'Could not connect to server' : 'تعذر الاتصال بالخادم'); }
                              }}
                              title={lang === 'en' ? 'Delete User' : 'حذف المستخدم'}
                              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', cursor: 'pointer', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.8rem' }}
                            >
                              <Trash2 size={14} /> {lang === 'en' ? 'Delete' : 'حذف'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab !== 'users' && (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Settings size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>{lang === 'en' ? 'This section is coming soon.' : 'هذا القسم قادم قريباً.'}</p>
          </div>
        )}
      </main>

      {/* Reset Password Modal */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setEditingUser(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px' }}>
                <Key size={20} color="var(--primary)" />
              </div>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                  {lang === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{editingUser.username} • {editingUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleResetPassword}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {lang === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}
              </label>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder={lang === 'en' ? 'Enter new password (min 6 chars)' : 'أدخل كلمة مرور جديدة (6 أحرف على الأقل)'}
                  style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={saving}>
                <Save size={16} /> {saving ? (lang === 'en' ? 'Saving...' : 'جاري الحفظ...') : (lang === 'en' ? 'Save New Password' : 'حفظ كلمة المرور الجديدة')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
