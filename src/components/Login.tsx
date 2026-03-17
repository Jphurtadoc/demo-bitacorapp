import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const DEMO_EMAIL = 'bitacorapp@demo.answertic.co';
  const DEMO_PASSWORD = 'Admin123*';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        alert('¡Login exitoso! Bienvenido a Bitacorapp Demo.');
      } else {
        setError('Credenciales incorrectas. Por favor, verifica los datos.');
      }
      setLoading(false);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple notification can be added here
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          {/* Logo Placeholder */}
          <div className="logo-container">
            <div className="logo-placeholder">
              <span className="logo-text">B</span>
            </div>
          </div>
          <h1>Bienvenido</h1>
          <p>Ingresa a tu cuenta de Bitacorapp</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="ejemplo@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="input-icon">✉️</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="input-icon password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '🔒'}
              </span>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Recuérdame
            </label>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="demo-credentials animate-slide-in">
          <div className="demo-header">
            <span>Datos de Acceso (Demo)</span>
          </div>
          <div className="credentials-list">
            <div className="credential-item" onClick={() => copyToClipboard(DEMO_EMAIL)}>
              <span className="label">Correo:</span>
              <span className="value">{DEMO_EMAIL}</span>
              <span className="copy-icon">📋</span>
            </div>
            <div className="credential-item" onClick={() => copyToClipboard(DEMO_PASSWORD)}>
              <span className="label">Contraseña:</span>
              <span className="value">{DEMO_PASSWORD}</span>
              <span className="copy-icon">📋</span>
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
        </div>
      </div>
      
      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </div>
  );
};

export default Login;
