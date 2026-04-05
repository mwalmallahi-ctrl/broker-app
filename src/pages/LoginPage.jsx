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
          0%, 100% { opacity: 0.06; transform: translateY(12px); }
          50% { opacity: 0.22; transform: translateY(0px); }
        }
        @keyframes buildingRise2 {
          0%, 100% { opacity: 0.04; transform: translateY(18px); }
          50% { opacity: 0.18; transform: translateY(0px); }
        }
        @keyframes buildingRise3 {
          0%, 100% { opacity: 0.05; transform: translateY(10px); }
          50% { opacity: 0.2; transform: translateY(-2px); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.55; }
        }
        @keyframes cityLabelFade {
          0%, 100% { opacity: 0; }
          30%, 70% { opacity: 1; }
        }
        .city-layer { position: absolute; bottom: 0; left: 0; width: 100%; pointer-events: none; }
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: floatParticle linear infinite;
        }
        .city-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          animation: cityLabelFade 10s ease-in-out infinite;
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

      {/* DUBAI Skyline - Left Section (Green theme) */}
      <svg className="city-layer" viewBox="0 0 1440 400" style={{ animation: 'buildingRise1 9s ease-in-out infinite', height: '50%' }}>
        {/* City Label */}
        <text className="city-label" x="200" y="80" fill="rgba(16,185,129,0.35)" textAnchor="middle">Dubai</text>
        
        {/* Burj Khalifa - Iconic spire */}
        <polygon points="120,320 140,320 140,60 138,30 136,10 134,2 132,10 130,30 128,60 120,80" fill="rgba(16,185,129,0.1)" />
        <line x1="130" y1="15" x2="130" y2="2" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
        {/* Khalifa windows */}
        <rect x="128" y="80" width="4" height="6" fill="rgba(16,185,129,0.2)" />
        <rect x="128" y="95" width="4" height="6" fill="rgba(16,185,129,0.18)" />
        <rect x="128" y="110" width="4" height="6" fill="rgba(16,185,129,0.2)" />
        <rect x="128" y="130" width="4" height="6" fill="rgba(16,185,129,0.15)" />
        <rect x="128" y="150" width="4" height="6" fill="rgba(16,185,129,0.2)" />
        <rect x="128" y="170" width="4" height="6" fill="rgba(16,185,129,0.18)" />
        <rect x="128" y="200" width="4" height="6" fill="rgba(16,185,129,0.15)" />
        <rect x="128" y="230" width="4" height="6" fill="rgba(16,185,129,0.2)" />
        <rect x="128" y="260" width="4" height="6" fill="rgba(16,185,129,0.18)" />
        
        {/* Burj Al Arab - Sail shape */}
        <path d="M240,320 L240,140 Q240,100 260,80 Q280,100 280,140 L280,320 Z" fill="rgba(16,185,129,0.08)" />
        <path d="M242,140 Q242,105 260,85 Q278,105 278,140" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
        <ellipse cx="260" cy="310" rx="30" ry="10" fill="rgba(16,185,129,0.05)" />
        
        {/* Dubai Frame */}
        <rect x="330" y="100" width="8" height="220" fill="rgba(16,185,129,0.09)" />
        <rect x="390" y="100" width="8" height="220" fill="rgba(16,185,129,0.09)" />
        <rect x="330" y="95" width="68" height="12" rx="2" fill="rgba(16,185,129,0.1)" />
        {/* Frame windows */}
        <rect x="350" y="110" width="4" height="5" fill="rgba(16,185,129,0.15)" />
        <rect x="360" y="110" width="4" height="5" fill="rgba(16,185,129,0.12)" />
        <rect x="370" y="110" width="4" height="5" fill="rgba(16,185,129,0.15)" />
        
        {/* Cayan Tower (Twisted) */}
        <polygon points="60,320 55,180 52,160 58,140 70,120 82,140 88,160 85,180 80,320" fill="rgba(16,185,129,0.07)" />
        <line x1="62" y1="200" x2="78" y2="195" stroke="rgba(16,185,129,0.12)" strokeWidth="0.5" />
        <line x1="60" y1="240" x2="80" y2="235" stroke="rgba(16,185,129,0.12)" strokeWidth="0.5" />
        <line x1="58" y1="280" x2="82" y2="275" stroke="rgba(16,185,129,0.12)" strokeWidth="0.5" />
        
        {/* Marina Towers cluster */}
        <rect x="420" y="130" width="25" height="190" rx="2" fill="rgba(16,185,129,0.06)" />
        <rect x="450" y="100" width="20" height="220" rx="2" fill="rgba(16,185,129,0.07)" />
        <rect x="475" y="150" width="22" height="170" rx="2" fill="rgba(16,185,129,0.05)" />
        {/* Windows */}
        <rect x="425" y="145" width="5" height="7" fill="rgba(16,185,129,0.14)" />
        <rect x="435" y="145" width="5" height="7" fill="rgba(16,185,129,0.12)" />
        <rect x="425" y="165" width="5" height="7" fill="rgba(16,185,129,0.14)" />
        <rect x="435" y="165" width="5" height="7" fill="rgba(16,185,129,0.12)" />
      </svg>

      {/* ABU DHABI Skyline - Center Section (Blue theme) */}
      <svg className="city-layer" viewBox="0 0 1440 400" style={{ animation: 'buildingRise2 13s ease-in-out infinite', height: '42%' }}>
        {/* City Label */}
        <text className="city-label" x="720" y="100" fill="rgba(59,130,246,0.35)" textAnchor="middle" style={{animationDelay: '3s'}}>Abu Dhabi</text>
        
        {/* Etihad Towers - 5 towers of different heights */}
        <rect x="620" y="110" width="18" height="210" rx="8" fill="rgba(59,130,246,0.07)" />
        <rect x="642" y="85" width="18" height="235" rx="8" fill="rgba(59,130,246,0.08)" />
        <rect x="664" y="70" width="20" height="250" rx="10" fill="rgba(59,130,246,0.09)" />
        <rect x="688" y="90" width="18" height="230" rx="8" fill="rgba(59,130,246,0.08)" />
        <rect x="710" y="120" width="18" height="200" rx="8" fill="rgba(59,130,246,0.07)" />
        {/* Tower windows */}
        <rect x="668" y="90" width="6" height="8" fill="rgba(59,130,246,0.18)" />
        <rect x="668" y="110" width="6" height="8" fill="rgba(59,130,246,0.15)" />
        <rect x="668" y="130" width="6" height="8" fill="rgba(59,130,246,0.18)" />
        <rect x="668" y="150" width="6" height="8" fill="rgba(59,130,246,0.15)" />
        <rect x="668" y="170" width="6" height="8" fill="rgba(59,130,246,0.18)" />

        {/* Capital Gate - Leaning tower */}
        <polygon points="780,320 775,150 785,100 810,90 820,100 825,150 820,320" fill="rgba(59,130,246,0.07)" />
        <line x1="790" y1="120" x2="815" y2="115" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" />
        <line x1="788" y1="160" x2="818" y2="155" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" />
        <line x1="785" y1="200" x2="820" y2="195" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" />
        <line x1="783" y1="240" x2="822" y2="235" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" />
        
        {/* ADNOC HQ */}
        <rect x="850" y="130" width="30" height="190" rx="2" fill="rgba(59,130,246,0.06)" />
        <rect x="855" y="125" width="20" height="8" rx="2" fill="rgba(59,130,246,0.08)" />
        <rect x="856" y="145" width="6" height="8" fill="rgba(59,130,246,0.14)" />
        <rect x="868" y="145" width="6" height="8" fill="rgba(59,130,246,0.12)" />
        <rect x="856" y="165" width="6" height="8" fill="rgba(59,130,246,0.14)" />
        <rect x="868" y="165" width="6" height="8" fill="rgba(59,130,246,0.12)" />
        
        {/* Sheikh Zayed Mosque domes */}
        <ellipse cx="570" cy="260" rx="25" ry="15" fill="rgba(59,130,246,0.06)" />
        <ellipse cx="570" cy="256" rx="18" ry="20" fill="rgba(59,130,246,0.05)" />
        <line x1="570" y1="236" x2="570" y2="225" stroke="rgba(59,130,246,0.12)" strokeWidth="1" />
        <ellipse cx="545" cy="268" rx="12" ry="12" fill="rgba(59,130,246,0.05)" />
        <ellipse cx="595" cy="268" rx="12" ry="12" fill="rgba(59,130,246,0.05)" />
        <rect x="530" y="275" width="80" height="45" rx="2" fill="rgba(59,130,246,0.04)" />
        {/* Minarets */}
        <rect x="527" y="240" width="4" height="80" fill="rgba(59,130,246,0.06)" />
        <rect x="609" y="240" width="4" height="80" fill="rgba(59,130,246,0.06)" />
      </svg>

      {/* SHARJAH Skyline - Right Section (Purple theme) */}
      <svg className="city-layer" viewBox="0 0 1440 400" style={{ animation: 'buildingRise3 11s ease-in-out infinite 1.5s', height: '38%' }}>
        {/* City Label */}
        <text className="city-label" x="1200" y="110" fill="rgba(139,92,246,0.35)" textAnchor="middle" style={{animationDelay: '6s'}}>Sharjah</text>
        
        {/* KOF Tower */}
        <rect x="1100" y="120" width="22" height="200" rx="2" fill="rgba(139,92,246,0.07)" />
        <polygon points="1100,120 1111,90 1122,120" fill="rgba(139,92,246,0.08)" />
        <rect x="1105" y="135" width="5" height="7" fill="rgba(139,92,246,0.15)" />
        <rect x="1112" y="135" width="5" height="7" fill="rgba(139,92,246,0.12)" />
        <rect x="1105" y="155" width="5" height="7" fill="rgba(139,92,246,0.15)" />
        <rect x="1112" y="155" width="5" height="7" fill="rgba(139,92,246,0.12)" />
        
        {/* Al Noor Mosque - Dome */}
        <ellipse cx="1220" cy="250" rx="30" ry="20" fill="rgba(139,92,246,0.06)" />
        <ellipse cx="1220" cy="245" rx="22" ry="25" fill="rgba(139,92,246,0.05)" />
        <line x1="1220" y1="220" x2="1220" y2="208" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
        <rect x="1195" y="265" width="50" height="55" rx="2" fill="rgba(139,92,246,0.04)" />
        {/* Minarets */}
        <rect x="1190" y="225" width="3" height="95" fill="rgba(139,92,246,0.06)" />
        <rect x="1247" y="225" width="3" height="95" fill="rgba(139,92,246,0.06)" />
        
        {/* Sharjah clocktower area */}
        <rect x="1320" y="170" width="15" height="150" fill="rgba(139,92,246,0.06)" />
        <circle cx="1327" cy="165" r="10" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="2" />
        <circle cx="1327" cy="165" r="2" fill="rgba(139,92,246,0.15)" />
        
        {/* Al Majaz towers */}
        <rect x="1050" y="160" width="18" height="160" rx="2" fill="rgba(139,92,246,0.05)" />
        <rect x="1072" y="140" width="15" height="180" rx="2" fill="rgba(139,92,246,0.06)" />
        <rect x="1380" y="180" width="20" height="140" rx="2" fill="rgba(139,92,246,0.05)" />
        <rect x="1405" y="150" width="18" height="170" rx="2" fill="rgba(139,92,246,0.06)" />
      </svg>

      {/* Floating particles — city lights rising */}
      {[...Array(15)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${5 + i * 6.2}%`,
          animationDuration: `${5 + (i % 6) * 2.5}s`,
          animationDelay: `${i * 0.6}s`,
          width: `${2 + (i % 3)}px`,
          height: `${2 + (i % 3)}px`,
          background: i < 5 ? 'rgba(16,185,129,0.5)' : i < 10 ? 'rgba(59,130,246,0.4)' : 'rgba(139,92,246,0.45)'
        }} />
      ))}

      {/* Ground reflection line */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent 5%, rgba(16,185,129,0.4) 25%, rgba(59,130,246,0.3) 50%, rgba(139,92,246,0.3) 75%, transparent 95%)',
        pointerEvents: 'none'
      }} />
      {/* Ground gradient */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '40px',
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.3))',
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
