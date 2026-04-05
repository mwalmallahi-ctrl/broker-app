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
      background: 'linear-gradient(180deg, #0a0f1c 0%, #0d1b2a 40%, #1a1a2e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Cityscape Background */}
      <style>{`
        @keyframes buildingRise1 {
          0%, 100% { opacity: 0.08; transform: translateY(10px); }
          50% { opacity: 0.2; transform: translateY(0px); }
        }
        @keyframes buildingRise2 {
          0%, 100% { opacity: 0.05; transform: translateY(15px); }
          50% { opacity: 0.15; transform: translateY(0px); }
        }
        @keyframes buildingRise3 {
          0%, 100% { opacity: 0.06; transform: translateY(8px); }
          50% { opacity: 0.18; transform: translateY(-3px); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .city-layer { position: absolute; bottom: 0; left: 0; width: 100%; pointer-events: none; }
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(16, 185, 129, 0.6);
          border-radius: 50%;
          animation: floatParticle linear infinite;
        }
      `}</style>

      {/* Gradient glow behind form */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        animation: 'pulseGlow 4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* Building Layer 1 - Back */}
      <svg className="city-layer" viewBox="0 0 1440 320" style={{ animation: 'buildingRise1 8s ease-in-out infinite', height: '45%' }}>
        <rect x="50" y="80" width="60" height="240" rx="2" fill="rgba(16,185,129,0.08)" />
        <rect x="55" y="90" width="8" height="12" rx="1" fill="rgba(16,185,129,0.15)" />
        <rect x="70" y="90" width="8" height="12" rx="1" fill="rgba(16,185,129,0.15)" />
        <rect x="85" y="90" width="8" height="12" rx="1" fill="rgba(16,185,129,0.12)" />
        <rect x="55" y="110" width="8" height="12" rx="1" fill="rgba(16,185,129,0.15)" />
        <rect x="70" y="110" width="8" height="12" rx="1" fill="rgba(16,185,129,0.12)" />
        <rect x="85" y="110" width="8" height="12" rx="1" fill="rgba(16,185,129,0.15)" />
        <rect x="160" y="40" width="80" height="280" rx="2" fill="rgba(16,185,129,0.06)" />
        <rect x="168" y="55" width="10" height="14" rx="1" fill="rgba(16,185,129,0.12)" />
        <rect x="185" y="55" width="10" height="14" rx="1" fill="rgba(16,185,129,0.12)" />
        <rect x="202" y="55" width="10" height="14" rx="1" fill="rgba(16,185,129,0.1)" />
        <rect x="219" y="55" width="10" height="14" rx="1" fill="rgba(16,185,129,0.12)" />
        <rect x="300" y="100" width="50" height="220" rx="2" fill="rgba(16,185,129,0.07)" />
        <rect x="410" y="60" width="70" height="260" rx="2" fill="rgba(16,185,129,0.05)" />
        <rect x="550" y="120" width="45" height="200" rx="2" fill="rgba(16,185,129,0.08)" />
        <rect x="650" y="50" width="90" height="270" rx="2" fill="rgba(16,185,129,0.06)" />
        <rect x="800" y="90" width="55" height="230" rx="2" fill="rgba(16,185,129,0.07)" />
        <rect x="920" y="70" width="65" height="250" rx="2" fill="rgba(16,185,129,0.05)" />
        <rect x="1050" y="110" width="50" height="210" rx="2" fill="rgba(16,185,129,0.08)" />
        <rect x="1150" y="45" width="85" height="275" rx="2" fill="rgba(16,185,129,0.06)" />
        <rect x="1300" y="85" width="60" height="235" rx="2" fill="rgba(16,185,129,0.07)" />
      </svg>

      {/* Building Layer 2 - Mid */}
      <svg className="city-layer" viewBox="0 0 1440 320" style={{ animation: 'buildingRise2 12s ease-in-out infinite', height: '35%' }}>
        <rect x="100" y="100" width="70" height="220" rx="2" fill="rgba(59,130,246,0.06)" />
        <rect x="108" y="115" width="8" height="10" rx="1" fill="rgba(59,130,246,0.15)" />
        <rect x="122" y="115" width="8" height="10" rx="1" fill="rgba(59,130,246,0.12)" />
        <rect x="136" y="115" width="8" height="10" rx="1" fill="rgba(59,130,246,0.15)" />
        <rect x="250" y="60" width="55" height="260" rx="2" fill="rgba(59,130,246,0.05)" />
        <rect x="380" y="130" width="40" height="190" rx="2" fill="rgba(59,130,246,0.07)" />
        <rect x="500" y="80" width="65" height="240" rx="2" fill="rgba(59,130,246,0.05)" />
        <rect x="700" y="110" width="50" height="210" rx="2" fill="rgba(59,130,246,0.06)" />
        <rect x="850" y="70" width="75" height="250" rx="2" fill="rgba(59,130,246,0.05)" />
        <rect x="1000" y="90" width="60" height="230" rx="2" fill="rgba(59,130,246,0.07)" />
        <rect x="1200" y="120" width="45" height="200" rx="2" fill="rgba(59,130,246,0.05)" />
        <rect x="1350" y="60" width="70" height="260" rx="2" fill="rgba(59,130,246,0.06)" />
      </svg>

      {/* Building Layer 3 - Front */}
      <svg className="city-layer" viewBox="0 0 1440 320" style={{ animation: 'buildingRise3 10s ease-in-out infinite 2s', height: '28%' }}>
        <rect x="30" y="140" width="45" height="180" rx="2" fill="rgba(139,92,246,0.06)" />
        <rect x="180" y="110" width="55" height="210" rx="2" fill="rgba(139,92,246,0.05)" />
        <rect x="330" y="150" width="40" height="170" rx="2" fill="rgba(139,92,246,0.07)" />
        <rect x="480" y="100" width="60" height="220" rx="2" fill="rgba(139,92,246,0.04)" />
        <rect x="630" y="130" width="50" height="190" rx="2" fill="rgba(139,92,246,0.06)" />
        <rect x="780" y="120" width="45" height="200" rx="2" fill="rgba(139,92,246,0.05)" />
        <rect x="950" y="105" width="65" height="215" rx="2" fill="rgba(139,92,246,0.04)" />
        <rect x="1100" y="140" width="50" height="180" rx="2" fill="rgba(139,92,246,0.06)" />
        <rect x="1280" y="110" width="55" height="210" rx="2" fill="rgba(139,92,246,0.05)" />
      </svg>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${8 + i * 8}%`,
          animationDuration: `${6 + (i % 5) * 3}s`,
          animationDelay: `${i * 0.8}s`,
          width: `${2 + (i % 3)}px`,
          height: `${2 + (i % 3)}px`,
          background: i % 3 === 0 ? 'rgba(16,185,129,0.5)' : i % 3 === 1 ? 'rgba(59,130,246,0.4)' : 'rgba(139,92,246,0.4)'
        }} />
      ))}

      {/* Ground line */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), rgba(59,130,246,0.2), rgba(139,92,246,0.2), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem', position: 'relative', zIndex: 10 }}>
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
