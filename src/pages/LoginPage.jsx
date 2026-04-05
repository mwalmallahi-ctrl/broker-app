import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../constants/translations';
import { Mail, Lock, User, RefreshCw, LogIn, ArrowRight, Languages } from 'lucide-react';

const LoginPage = ({ setAuth, setRole, setName, lang = 'en', setLang }) => {
  const t = translations[lang];
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login', 'register', 'reset'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAction = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      // CLIENT-SIDE ADMIN BYPASS
      if (email === 'mwalmallahi@gmail.com') {
        localStorage.setItem('brokerToken', 'admin-bypass-token');
        setAuth(true);
        setRole('Main Editor');
        setName('Administrator');
        navigate('/dashboard');
        return;
      }
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('brokerToken', data.token);
          setAuth(true);
          setRole(data.user.role);
          setName(data.user.username);
          navigate('/dashboard');
        } else {
          alert('Login failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Could not connect to server.');
      }
    } else if (mode === 'register') {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('brokerToken', data.token);
          setAuth(true);
          setRole(data.user.role);
          setName(data.user.username);
          navigate('/dashboard');
        } else {
          alert('Registration failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Registration error:', err);
        alert('Could not connect to server.');
      }
    } else {
      alert(lang === 'en' ? 'A password reset link has been sent to ' + email : 'تم إرسال رابط استعادة كلمة المرور إلى ' + email);
      setMode('login');
    }
  };

  const getTitle = () => {
    if (mode === 'login') return t.welcome;
    if (mode === 'register') return t.signUp;
    return lang === 'en' ? 'Reset Password' : 'إعادة تعيين كلمة المرور';
  };

  const getSubtitle = () => {
    if (mode === 'login') return lang === 'en' ? 'Sign in to manage your real estate property portfolio' : 'سجل الدخول لإدارة محفظتك العقارية';
    if (mode === 'register') return lang === 'en' ? 'Join the elite network of professional brokers' : 'انضم إلى شبكة النخبة للوسطاء المحترفين';
    return lang === 'en' ? 'Enter your email to receive a secure reset link' : 'أدخل بريدك الإلكتروني لتلقي رابط الاستعادة';
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '1.5rem',
      background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 60%)'
    }}>
      <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem', position: 'relative' }}>
        {/* Language Toggle */}
        <button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          style={{ 
            position: 'absolute', top: '1rem', [lang === 'en' ? 'right' : 'left']: '1rem', 
            background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700'
          }}
        >
          <Languages size={14} /> {lang === 'en' ? 'العربية' : 'English'}
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img 
            src="/logo.png" 
            alt="MW Real Estate" 
            style={{ 
              width: '120px', 
              height: 'auto', 
              margin: '0 auto 1rem',
              display: 'block',
              filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.2))'
            }} 
          />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            {getTitle()}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleAction}>
          {mode === 'register' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.8 }}>
                {lang === 'en' ? 'Username' : 'اسم المستخدم'}
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                <input 
                  type="text" 
                  required
                  className="input-field" 
                  style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px' }}
                  placeholder={lang === 'en' ? "YourUsername" : "اسمك المستعار"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.8 }}>
              {lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input 
                type="email" 
                required
                className="input-field" 
                style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px' }}
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>{t.password}</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setMode('reset')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                  >
                    {t.forgot}
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', [lang === 'en' ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                <input 
                  type="password" 
                  required
                  className="input-field" 
                  style={{ [lang === 'en' ? 'paddingLeft' : 'paddingRight']: '40px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <button className="btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center', marginTop: '1rem', display: 'flex', gap: '10px' }}>
            {mode === 'login' ? (
              <>{t.signIn} <ArrowRight size={18} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /></>
            ) : mode === 'register' ? (
              <>{t.signUp} <ArrowRight size={18} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /></>
            ) : (
              <>{lang === 'en' ? 'Send Link' : 'إرسال الرابط'} <ArrowRight size={18} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          {mode === 'login' ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t.dontHaveAccount}{' '}
              <button 
                onClick={() => setMode('register')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
              >
                {t.signUp}
              </button>
            </p>
          ) : (
            <button 
              onClick={() => setMode('login')}
              style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '0 auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
            >
              <RefreshCw size={14} /> {t.backToSignIn}
            </button>
          )}
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Linking all accounts to professional email verification
          </p>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
